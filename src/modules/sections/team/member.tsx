import React from 'react'

interface MemberProps {
    name: string
    role: string
    image: string
}

function Member({ name, role, image }: MemberProps) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 text-lg">
                    {name}
                </h3>
                <p className="text-gray-600 text-sm">
                    {role}
                </p>
            </div>
        </div>
    )
}

export default Member