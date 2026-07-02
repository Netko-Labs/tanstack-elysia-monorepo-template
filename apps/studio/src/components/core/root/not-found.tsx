import { Link } from '@tanstack/react-router'
import {
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HEADING,
  NOT_FOUND_HOME_LABEL,
  NOT_FOUND_TITLE,
} from './lib'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">{NOT_FOUND_HEADING}</h1>
        <p className="mt-4 text-xl text-gray-600">{NOT_FOUND_TITLE}</p>
        <p className="mt-2 text-gray-500">{NOT_FOUND_DESCRIPTION}</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {NOT_FOUND_HOME_LABEL}
        </Link>
      </div>
    </div>
  )
}
