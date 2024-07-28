import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FeedbackForm from './FeedbackForm'


const page = () => {
  return (
    // <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen p-8">
    //   <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm">
    //     <CardHeader>
    //       <div className="flex items-center space-x-4">
    //         <Avatar className="w-20 h-20">
    //           <AvatarImage src="/your-photo.jpg" alt="Your Name" />
    //           <AvatarFallback>SN</AvatarFallback>
    //         </Avatar>
    //         <div>
    //           <CardTitle className="text-3xl font-bold">Hey there! I'm Saif Nasir</CardTitle>
    //           <p className="text-lg text-muted-foreground">Student, dreamer, and creator</p>
    //         </div>
    //       </div>
    //     </CardHeader>
    //     <CardContent className="space-y-8">
    //       <section>
    //         <h2 className="text-2xl font-semibold mb-4">What I'm Up To</h2>
    //         <p className="mb-4">
    //         </p>
    //         <p>
    //           Why? Because I've seen too many brilliant ideas held back by clunky tools. You've got enough on your plate without wrestling with complicated form builders, right?
    //         </p>
    //       </section>

    //       <section>
    //         <h2 className="text-2xl font-semibold mb-4">A Bit About Me</h2>
    //         <p className="mb-4">
    //           I'm obsessed with finding simple solutions to complex problems. That's what drove me to start this project. I believe that with the right tools, anyone can bring their business ideas to life.
    //         </p>
    //       </section>

    //       <section>
    //         <h2 className="text-2xl font-semibold mb-4">Why This Matters</h2>
    //         <p className="mb-4">
    //         </p>
    //         <p>
    //           Together, we're going to make creating forms so easy, you might actually look forward to it. (Okay, maybe that's a stretch, but you'll definitely hate it less!)
    //         </p>
    //       </section>

    //       <section>
    //         <h2 className="text-2xl font-semibold mb-4">Let's Connect!</h2>
    //         <p className="mb-4">
    //           I'd love to hear your thoughts, ideas, or even your form-building horror stories. Who knows? Your input could shape the next big feature of this tool.
    //         </p>
    //         <p className="mb-4">
    //           Whether you're a startup founder, a small business owner, or just someone with a cool idea, I'm here to chat. Let's make something awesome together!
    //         </p>
    //         <Button size="lg">Say Hello!</Button>
    //       </section>
    //     </CardContent>
    //   </Card>
    // </div>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">Why This Matters</h2>
            <p className="mb-4">
              I get it. You're pouring your heart and soul into your business. The last thing you need is to be bogged down by tech hassles. That's where my AI form builder comes in. It's like having a tech-savvy friend who just gets what you need.
            </p>

            <p className="mb-4">
              Your brand is unique, and every touchpoint with your customers should reflect that. Generic forms can disrupt the user experience and diminish the professional image you've worked hard to build. My tool ensures that doesn't happen.
            </p>
            <p>
              Whether it's a contact form, a survey, or a complex data collection process, each form will look and feel like it was custom-built for your business – because it will be.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">A Bit About Me</h2>
            <p className="mb-4">
              I'm a Computer Science student at King's College London, passionate about creating tools that empower businesses.
            </p>
            <p>
              I started this project because I believe that small businesses and startups deserve enterprise-level tools without the enterprise-level complexity or cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Fully customizable designs to match your brand</li>
              <li>AI-powered suggestions for form structure and fields</li>
              <li>Seamless integration with your website or app</li>
              <li>Advanced analytics to help you understand your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Let's Elevate Your Brand Together</h2>
            <p className="mb-4">
              I'm excited to help you create forms that not only function flawlessly but also strengthen your brand with every use. Whether you're a startup founder, a small business owner, or part of a growing enterprise, I'd love to chat about how we can make your forms work harder for your brand.
            </p>

          </section>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default page