"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import React from 'react'

type Props = {}

function UnitySelector({}: Props) {
  return (
    <div className="bg-white">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default UnitySelector
