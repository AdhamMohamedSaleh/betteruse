import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const styles = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
  success:
    'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100',
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const Icon = icons[type]

  return (
    <div
      className={cn(
        'my-6 flex gap-3 rounded-lg border p-4',
        styles[type]
      )}
    >
      <Icon className="mt-1 h-5 w-5 flex-shrink-0" />
      <div className="text-sm [&>p]:m-0">{children}</div>
    </div>
  )
}
