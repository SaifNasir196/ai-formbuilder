// app/components/FeedbackForm.tsx
'use client';

import { useState, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recommendationValue, setRecommendationValue] = useState([8])
  const { toast } = useToast()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Add the recommendation value to the form data
    data.recommendation = recommendationValue[0].toString()

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        })
        event.currentTarget.reset()
        setRecommendationValue([5]) // Reset the slider
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-28 bg-transparent outline-none border-none w-2/3 shadow-none ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">We'd Love Your Feedback!</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" name="company" placeholder="Your company name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">How did you hear about us?</Label>
            <Select name="source">
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search Engine</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="friend">Friend or Colleague</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>How likely are you to recommend our AI Form Builder? (1-10)</Label>
            <Slider
              min={1}
              max={10}
              step={1}
              
              value={recommendationValue}
              onValueChange={setRecommendationValue}
            />
            <div className="text-left mt-3 text-sm text-gray-500">
              Selected value: {recommendationValue}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea id="feedback" name="feedback" placeholder="Please share your thoughts, suggestions, or concerns..." required />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}