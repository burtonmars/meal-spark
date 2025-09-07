'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Meal } from '../definitions'

const fetchMeals = async (): Promise<Meal[]> => {
  const response = await fetch('/api/meals')
  if (!response.ok) throw new Error('Failed to fetch meals')
  return response.json()
}

const deleteMeal = async (id: string): Promise<void> => {
  const response = await fetch(`/api/meals/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete meal')
}

const addMeal = async (meal: Omit<Meal, 'id' | 'userId'>): Promise<Meal> => {
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  })
  if (!response.ok) throw new Error('Failed to add meal')
  return response.json()
}

export const useMeals = () => {
  return useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  })
}

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}

export const useAddMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addMeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}
