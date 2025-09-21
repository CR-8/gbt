import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorStateProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info' | 'success'
  action?: React.ReactNode
}

export function ErrorState({ 
  title, 
  message, 
  type = 'error', 
  action 
}: ErrorStateProps) {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle
  }

  const variants = {
    error: 'destructive' as const,
    warning: 'default' as const,
    info: 'default' as const,
    success: 'default' as const
  }

  const Icon = icons[type]

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center space-y-4 max-w-md">
        <Alert variant={variants[type]} className="text-left">
          <Icon className="h-4 w-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        {action && action}
      </div>
    </div>
  )
}