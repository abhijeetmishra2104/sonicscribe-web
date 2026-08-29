'use client'
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Mail } from "lucide-react"
import { LogoMark } from "@/components/ui/logo"

export default function Footer() {
  return (
    <footer className="w-full bg-background text-muted-foreground border-t border-border">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5 text-sm text-center md:text-left">
          <LogoMark className="h-5 w-5 text-blue-400" />
          <span>© {new Date().getFullYear()} SonicScribe. All rights reserved.</span>
        </div>
        <Separator className="md:hidden" />
        <div className="flex gap-4">
          <a href="https://github.com/abhijeetmishra2104/SonicScribe" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
          <a href="https://x.com/AbhijeetMi53781" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
          <a href="abhijeetmishra2104@gmail.com">
            <Mail className="h-5 w-5 hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  )
}
