import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FeedbackForm from './FeedbackForm'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



const page = () => {
  return (

     <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen p-12">
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-12">
        <CardHeader>
          <div className="flex items-center space-x-4 gap-5">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/portrait.png" alt="Your Name" />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">Hey there! I'm Saif Nasir</CardTitle>
              <p className="text-lg text-muted-foreground">Empowering businesses with seamless, branded forms</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-800">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Forms, Your Brand</h2>
            <p className="mb-4">
              I'm creating an AI-powered form builder that lets you design forms that look and feel like an integral part of your business. No more generic, out-of-place forms that scream "third-party tool." With this solution, your forms will be a seamless extension of your brand.
            </p>
            <p>
              Imagine forms that not only collect data efficiently but also reinforce your brand identity at every interaction. That's the power I'm putting in your hands.
            </p>
          </section>
          

            <Accordion type="single" collapsible>
      
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">Why This Matters</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    I get it. You're pouring your heart and soul into your business. The last thing you need is to be bogged down by tech hassles. That's where my AI form builder comes in. It's like having a tech-savvy friend who just gets what you need.
                  </p>

                  <p className="mb-4">
                    Your brand is unique, and every touchpoint with your customers should reflect that. Generic forms can disrupt the user experience and diminish the professional image you've worked hard to build. My tool ensures that doesn't happen.
                  </p>
                  <p>
                    Whether it's a contact form, a survey, or a complex data collection process, each form will look and feel like it was custom-built for your business – because it will be.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold">A  Bit About Me</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    I'm a Computer Science student at King's College London, passionate about creating tools that empower businesses.
                  </p>
                  <p>
                    I started this project because I believe that small businesses and startups deserve enterprise-level tools without the enterprise-level complexity or cost.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold">Key Features</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Fully customizable designs to match your brand</li>
                    <li>AI-powered suggestions for form structure and fields</li>
                    <li>Seamless integration with your website or app</li>
                    <li>Advanced analytics to help you understand your data</li>
                  </ul>
      
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl font-semibold">Let's Elevate Your Brand Together</AccordionTrigger>
                <AccordionContent>
                   <p className="mb-4">
                    I'm excited to help you create forms that not only function flawlessly but also strengthen your brand with every use. Whether you're a startup founder, a small business owner, or part of a growing enterprise, I'd love to chat about how we can make your forms work harder for your brand.
                  </p>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
        
          <FeedbackForm />
          
        </CardContent>
      </Card>
    </div>
  )
}

export default page