"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useTotalStats } from "@/app/hooks/useForms"
import { Skeleton } from '@/components/ui/skeleton'

const FormStats = () => {
    const { data, isLoading, error } = useTotalStats()


    if (error) return <div>Error</div>

    console.log('data', data);
    return (
        <div className="flex gap-4 w-full justify-center flex-wrap">
            <Card className='w-64'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isLoading
                            ? <Skeleton className="w-20 h-10" />
                            : <div className="text-4xl font-bold">{data?.submissions}</div>
                    }
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

            <Card className='w-56'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Visits</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isLoading
                            ? <Skeleton className="w-20 h-10" />
                            : <div className="text-4xl font-bold">{data?.submissions}</div>
                    }
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

            <Card className='w-56'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Submission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isLoading
                            ? <Skeleton className="w-20 h-10" />
                            : <div className="text-4xl font-bold">{data?.submissions}</div>
                    }

                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

            <Card className='w-56'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Bounce rate</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isLoading
                            ? <Skeleton className="w-20 h-10" />
                            : <div className="text-4xl font-bold">{data?.submissions}</div>
                    }
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

        </div>
    )
}

export default FormStats