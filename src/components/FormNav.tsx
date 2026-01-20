import React from 'react'
import { Button } from './ui/button'
import { useNavigate, useRouteContext } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type UUID = string

interface FormNavProps {
  backLink: string
  nextLink: string
  backTitle: string
  nextTitle: string
  disableNext?: boolean // Add this prop
}

export default function FormNav({
  backLink,
  nextLink,
  backTitle,
  nextTitle,
  disableNext = false, // Default to false
}: FormNavProps) {
  const navigate = useNavigate()
  const { sessionId, textAction, authorAction, textId, authorId } =
    useRouteContext({
      from: '/_form',
    }) as {
      sessionId?: string
      textAction?: 'edit' | 'create'
      authorAction?: 'edit' | 'create'
      textId: string
      authorId: string
    }

  // const formURLs = ['/add', '/select']
  return (
    <div className="flex justify-between w-full max-w-[40rem] ">
      {backLink !== '' && (
        <div className="flex flex-col items-start gap-3">
          <Button
            variant="outline"
            onClick={() => {
              navigate({
                to: backLink,
                search: {
                  sessionId,
                  textAction,
                  authorAction,
                  textId,
                  authorId,
                },
              })
            }}
          >
            <ArrowLeft />
            {backTitle}
          </Button>
          {/* <div className="text-sm font-normal"></div> */}
        </div>
      )}
      {nextLink !== '' && (
        <div className="flex flex-col items-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              navigate({
                to: nextLink,
                search: {
                  sessionId,
                  textAction,
                  authorAction,
                  textId,
                  authorId,
                },
              })
            }}
            disabled={disableNext} // Add disabled prop
          >
            {nextTitle}
            <ArrowRight />
          </Button>
          {/* <div className="text-sm font-normal">{nextTitle}</div> */}
        </div>
      )}
    </div>
  )
}
