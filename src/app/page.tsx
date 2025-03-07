import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { UrlProcessor } from "@/components/url-processor"

export default function Page() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <UrlProcessor />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
} 