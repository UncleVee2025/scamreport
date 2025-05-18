"use client"

import { useState, useCallback } from "react"

export function useCheckbox(initialState = false) {
  const [checked, setChecked] = useState(initialState)

  const handleChange = useCallback((value: boolean) => {
    setChecked(value)
  }, [])

  return [checked, handleChange] as const
}
