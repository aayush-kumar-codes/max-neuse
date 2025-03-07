import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { processUrl } from "@/services/api"

type ProcessingStatus = "waiting" | "processing" | "finished"

interface UrlEntry {
  id: string
  url: string
  status: ProcessingStatus
}

export function UrlProcessor() {
  const [urls, setUrls] = React.useState<UrlEntry[]>([])
  const [newUrl, setNewUrl] = React.useState("")

  const handleAddUrl = async () => {
    if (!newUrl) return

    const newEntry: UrlEntry = {
      id: Date.now().toString(),
      url: newUrl,
      status: "waiting"
    }

    setUrls(prev => [...prev, newEntry])
    setNewUrl("")

    try {
      // Update to processing status
      setUrls(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, status: "processing" } 
            : entry
        )
      )

      // Call backend API
      await processUrl(newUrl)

      // Update to finished status
      setUrls(prev => 
        prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, status: "finished" } 
            : entry
        )
      )
    } catch (error) {
      console.error('Error processing URL:', error)
      // Handle error state if needed
    }
  }

  const handleRemove = (id: string) => {
    setUrls(prev => prev.filter(entry => entry.id !== id))
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter URL..."
          className="flex-1"
        />
        <Button onClick={handleAddUrl}>Add</Button>
      </div>

      <div className="space-y-2">
        {urls.map((entry) => (
          <div 
            key={entry.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex-1 truncate mr-2">
              {entry.url}
            </div>
            <div className="flex items-center gap-2">
              {entry.status === "waiting" && (
                <span className="text-yellow-500">Waiting</span>
              )}
              {entry.status === "processing" && (
                <span className="text-blue-500">Processing</span>
              )}
              {entry.status === "finished" && (
                <span className="text-green-500">Finished</span>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleRemove(entry.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 