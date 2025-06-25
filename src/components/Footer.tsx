'use client'
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-background text-muted-foreground border-t border-border">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} SonicScribe. All rights reserved.
        </div>
        <Separator className="md:hidden" />
        <div className="flex gap-4">
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
          <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
          <a href="mailto:contact@yourdomain.com">
            <Mail className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  )
}
