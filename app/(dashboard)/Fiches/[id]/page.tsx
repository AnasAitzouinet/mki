import { GetFichItem } from '@/server/Data'
import React from 'react'
import Fich from './Fich'

export default async function page({ params }: { params: { id: string } }) {
    const data = await GetFichItem(params.id)

    if (!data) {
        return (
            <div>
                <h1>
                    Fiche introuvable
                </h1>
            </div>
        )
    }
    return (
        <Fich {...data} />
    )
}
