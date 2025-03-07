import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Plus, RefreshCcw, X } from "lucide-react";
import APIStatus from './APIStatus';
import DebugPanel from './DebugPanel';
import StatusIndicator from './StatusIndicator';
import { cn } from "@/lib/utils";
import { pb } from '@/Pocketbase';
import PocketBase from 'pocketbase';
interface Match {
  id: string;
  url: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  result?: any; // To store API response
}

// Add interface for FootyStats response
interface FootyStatsResponse {
  fs_home_id?: string;
  fs_away_id?: string;
  // ... other fields
}

const Dashboard: React.FC = () => {
  // State for URL inputs
  const [footyStatsUrl, setFootyStatsUrl] = useState('');
  const [transfermarktUrl, setTransfermarktUrl] = useState('');
  const [ivibetxUrl, setIvibetxUrl] = useState('');
  const [controllers, setControllers] = useState<{ [key: string]: AbortController }>({});

  // State for matches
  const [matches, setMatches] = useState<Match[]>([]);

  // API information
  const apiStatus = "ready";
  const debugInfo = {
    apiUrl: "hhttps://tips.olma5.dev/odds",
    lastRequest: "https://ivibetx.com/prematch/football/1008013-premier-league/5546292-nottingham-forest-manchester-city"
  };

  // Add new state for tracking job completion
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  // Function to check if all URLs in a group are completed
  const checkAllCompleted = (matches: Match[]) => {
    const baseId = matches[0]?.id.split('-')[0];
    const groupMatches = matches.filter(m => m.id.startsWith(baseId));
    return groupMatches.every(m => m.status === 'completed');
  };

  const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your live PocketBase URL

  const saveDataToPocketBase = async (mergedData) => {
      try {
          const record = await pb.collection('scraped_data').create({
              data: mergedData
          });
  
          console.log('Data saved:', record);
          alert('Data successfully saved to PocketBase!');
      } catch (error) {
          console.error('Error saving data:', error);
      }
  };
  // Function to download merged JSON
  const handleDownloadJSON = (baseId: string) => {
    const completedMatches = matches.filter(m =>
      m.id.startsWith(baseId) &&
      m.status === 'completed' &&
      m.result
    );

    // Merge results from all completed matches
    const mergedData = {
      id: baseId,
      timestamp: new Date().toISOString(),
      footyStats: completedMatches.find(m => m.url.includes('footystats'))?.result,
      transfermarkt: completedMatches.find(m => m.url.includes('transfermarkt'))?.result,
      ivibetx: completedMatches.find(m => m.url.includes('ivibetx'))?.result
    };
    saveDataToPocketBase(mergedData)
    // Create and download file
    const blob = new Blob([JSON.stringify(mergedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-data-${baseId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const baseUrl = 'https://tips.olma5.dev';


  const fetchFootwalldata = async (id: number) => {
    try {
      const response = await fetch(`https://api.football-data-api.com/league-players?key=33c67abbf60ce13929cf78fc532396bc9e6b960b7985c529599c8afd27227a08&season\_id=${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      console.log(response, "===========response");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error fetching FootyStats data:', error);
    }
  };
  const fetchTeam = async (teamId: number) => {
    try {
      const response = await fetch(`${baseUrl}/team?team_id=${teamId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      const result = await response.json()
      console.log(result, "===========!!!!!!!!");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error fetching FootyStats data:', error);
    }
  };
  const fetchData = async (homeId: number, teamId: number) => {
    try {
      const response = await fetch(`${baseUrl}/team?team_id=${homeId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      const result = await response.json();
      console.log(result, "===========response@@@@@@@@");
      fetchFootwalldata(result?.competitions?.competition_id)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error fetching FootyStats data:', error);
    } finally {
      fetchTeam(teamId)
    }
  };

  // Update processUrl to use local API routes
  const processUrl = async (url: string, type: 'footy' | 'transfer' | 'ivibetx') => {
    try {
      const baseUrl = 'https://tips.olma5.dev';
      let footyData = null;

      // First process FootyStats if it's available
      if (footyStatsUrl) {
        const footyEndpoint = '/match';
        const footyParams = `?match_url=${encodeURIComponent(footyStatsUrl)}`;

        try {
          const footyResponse = await fetch(`${baseUrl}${footyEndpoint}${footyParams}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit'
          });

          if (footyResponse.ok) {
            footyData = await footyResponse.json();
            fetchData(footyData.home_team_id, footyData.away_team_id)
            console.log('FootyStats data:', footyData); // Debug log
          }
        } catch (error) {
          console.error('Error fetching FootyStats data:', error);
        }
      }

      // Construct URL based on type
      const endpoint = type === 'footy' ? '/match' :
        type === 'transfer' ? '/squad/' :
          '/odds/';  // default for ivibetx

      let queryParams = '';
      if (type === 'footy') {
        queryParams = `?match_url=${encodeURIComponent(url)}&API_KEY=33c67abbf60ce13929cf78fc532396bc9e6b960b7985c529599c8afd27227a08`;
      } else if (type === 'transfer' && footyData?.fs_home_id && footyData?.fs_away_id) {
        // Only add team IDs if they exist
        queryParams = `?url=${encodeURIComponent(url)}&fs_home_id=${footyData.fs_home_id}&fs_away_id=${footyData.fs_away_id}`;
      } else {
        queryParams = `?url=${encodeURIComponent(url)}`;
      }

      const fullUrl = `${baseUrl}${endpoint}${queryParams}`;
      console.log('Requesting URL:', fullUrl); // Debug log

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: type === 'transfer' ? 'no-cors' as const : 'cors' as const,
        credentials: 'omit' as const
      };

      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok && type !== 'transfer') {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const result = type === 'transfer' ? { status: 'completed' } : await response.json();

      // Store the result locally instead of trying to save to a file
      if (result) {
        try {
          // Store in localStorage for now
          const results = JSON.parse(localStorage.getItem('matchResults') || '[]');
          results.push({
            id: Date.now(),
            data: result,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('matchResults', JSON.stringify(results));
        } catch (error) {
          console.error('Error storing result:', error);
        }
      }

      return result;
    } catch (error) {
      console.error('Error processing URL:', error);
      throw error;
    }
  };



  // Add error handling state
  const [error, setError] = useState<string | null>(null);

  // Updated handleAdd function
  const handleAdd = async () => {
    // if (!footyStatsUrl && !transfermarktUrl && !ivibetxUrl) return;
    if (!footyStatsUrl) return;

    const baseId = Date.now().toString();

    // Create array of URLs in the correct order
    const urls = [];

    // Always add FootyStats first if available
    if (footyStatsUrl) {
      urls.push({ url: footyStatsUrl, type: 'footy' as const });
    }

    // Then Transfermarkt
    // if (transfermarktUrl) {
    //   urls.push({ url: transfermarktUrl, type: 'transfer' as const });
    // }

    // // Finally IVIbetx
    // if (ivibetxUrl) {
    //   urls.push({ url: ivibetxUrl, type: 'ivibetx' as const });
    // }

    // Add waiting status for all URLs
    setMatches(prev => [
      ...prev,
      ...urls.map((item, index) => ({
        id: `${baseId}-${index}-waiting`,
        url: item.url,
        status: 'waiting' as const
      }))
    ]);

    // Process URLs sequentially
    for (let i = 0; i < urls.length; i++) {
      const { url, type } = urls[i];
      try {
        // Update to processing status
        setMatches(prev => [
          ...prev.filter(m => m.id !== `${baseId}-${i}-waiting`),
          {
            id: `${baseId}-${i}-processing`,
            url,
            status: 'processing'
          }
        ]);

        const result = await processUrl(url, type);

        // Update to completed status
        setMatches(prev => [
          ...prev.filter(m => m.id !== `${baseId}-${i}-processing`),
          {
            id: `${baseId}-${i}-completed`,
            url,
            status: 'completed',
            result
          }
        ]);
      } catch (error) {
        console.error('API Error:', error);
        setMatches(prev => [
          ...prev.filter(m => m.id !== `${baseId}-${i}-processing`),
          {
            id: `${baseId}-${i}-error`,
            url,
            status: 'error'
          }
        ]);
      }
    }

    // After processing all URLs, check if they're all completed
    setIsAllCompleted(checkAllCompleted(matches));

    // Clear input fields
    setFootyStatsUrl('');
    setTransfermarktUrl('');
    setIvibetxUrl('');
  };


  // Update handleFillTest
  const handleFillTest = () => {
    setFootyStatsUrl('https://footystats.org/england/southampton-fc-vs-liverpool-fc-h2h-stats');
    setTransfermarktUrl('https://www.transfermarkt.com/borussia-monchengladbach_1-fsv-mainz-05/index/spielbericht/4373732');
    setIvibetxUrl('https://ivibetx.com/prematch/football/1008013-premier-league/5546292-nottingham-forest-manchester-city');
  };

  // Helper function to group matches by their base ID
  const groupMatches = (matches: Match[]) => {
    const groups: { [key: string]: Match[] } = {};
    matches.forEach(match => {
      const baseId = match.id.split('-')[0];
      if (!groups[baseId]) {
        groups[baseId] = [];
      }
      groups[baseId].push(match);
    });
    return groups;
  };

  // Update handleRemove to remove entire group
  const handleRemoveJob = (baseId: string) => {
    setMatches(prev => prev.filter(match => !match.id.startsWith(baseId)));
  };

  // Update the extractMatchName function
  const extractMatchName = (url: string) => {
    if (!url.includes('footystats.org')) return '';

    try {
      // Split URL by '/' and get relevant parts
      const parts = url.split('/');
      const country = parts[parts.length - 2]; // Get the country/league name
      const match = parts[parts.length - 1].replace('-h2h-stats', '');

      if (!match) return '';

      // Format country name
      const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1);

      // Format match name
      const formattedMatch = match
        .split('-')
        .map(word => word === 'fc' ? 'FC' : word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return `${formattedCountry} - ${formattedMatch}`;
    } catch (error) {
      console.error('Error extracting match name:', error);
      return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <section className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">URL Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage your data sources and API endpoints
          </p>
        </div>

        {/* URL Input Form */}
        <Card className="overflow-hidden border-border/40 shadow-sm bg-card/80 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-3">
                <label htmlFor="footyStatsUrl" className="block text-sm font-medium mb-1">FootyStats URL</label>
                <Input
                  id="footyStatsUrl"
                  placeholder="Enter FootyStats URL"
                  value={footyStatsUrl}
                  onChange={(e) => setFootyStatsUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="col-span-12 sm:col-span-3">
                <label htmlFor="transfermarktUrl" className="block text-sm font-medium mb-1">Transfermarkt URL</label>
                <Input
                  id="transfermarktUrl"
                  placeholder="Enter Transfermarkt URL"
                  value={transfermarktUrl}
                  onChange={(e) => setTransfermarktUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="col-span-12 sm:col-span-3">
                <label htmlFor="ivibetxUrl" className="block text-sm font-medium mb-1">IVIbetx URL</label>
                <Input
                  id="ivibetxUrl"
                  placeholder="Enter IVIbetx URL"
                  value={ivibetxUrl}
                  onChange={(e) => setIvibetxUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="col-span-12 sm:col-span-3 flex items-end">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 h-10"
                  onClick={handleAdd}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleFillTest}
              >
                <RefreshCcw className="mr-1 h-4 w-4" /> Fill Test IVIbetx URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Updated Matches Table */}
        {matches.length > 0 && (
          <div className="mt-6">
            {Object.entries(groupMatches(matches)).map(([baseId, groupedMatches]) => {
              // Find FootyStats URL in the group
              const footyStatsMatch = groupedMatches.find(m => m.url.includes('footystats.org'));
              const matchName = footyStatsMatch ? extractMatchName(footyStatsMatch.url) : '';

              return (
                <div key={baseId} className="mb-6 border rounded-lg overflow-hidden">
                  <div className="bg-muted/20 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold truncate">{matchName}</h3>
                        <p className="text-xs text-muted-foreground">Job ID: {baseId}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {groupedMatches.every(m => m.status === 'completed') ? (
                          <>
                            <Button
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleDownloadJSON(baseId)}
                            >
                              <Globe className="mr-1 h-4 w-4" /> Download JSON
                            </Button>
                          </>

                        ) : (
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveJob(baseId)}
                          >
                            Remove Job
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="divide-y">
                    {groupedMatches.map((match) => (
                      <div
                        key={match.id}
                        className={cn(
                          "grid grid-cols-12 px-4 py-3",
                          match.status === 'waiting' && "bg-yellow-50",
                          match.status === 'processing' && "bg-blue-50",
                          match.status === 'completed' && "bg-green-50",
                          match.status === 'error' && "bg-red-50"
                        )}
                      >
                        <div className="col-span-3 truncate font-mono text-xs">
                          {match.url.includes('footystats') ? 'FootyStats' :
                            match.url.includes('transfermarkt') ? 'Transfermarkt' :
                              'IVIbetx'}
                        </div>
                        <div className="col-span-8 truncate font-mono text-xs">
                          {match.url}
                        </div>
                        <div className="col-span-1 flex justify-center items-center">
                          <StatusIndicator
                            status={
                              match.status === 'waiting' ? 'pending' :
                                match.status === 'processing' ? 'pending' :
                                  match.status === 'error' ? 'error' : 'ready'
                            }
                            size="sm"
                            text={match.status}
                          />
                          {match.status === 'processing' && (
                            <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      <section className="grid gap-5 md:grid-cols-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <APIStatus
          status={apiStatus as 'ready' | 'error' | 'pending'}
          className="md:col-span-6"
        />

        <DebugPanel
          apiUrl={debugInfo.apiUrl}
          lastRequest={debugInfo.lastRequest}
          className="md:col-span-6"
        />
      </section>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
