'use client'
export default function IndustryPage() {

    const industry = {
        "industryname": "Technology",
        "description": "The technology industry encompasses companies involved in the development, manufacturing, and distribution of technological products and services.",
     }
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Industry</h1>
            <IndustryCard prop={industry} whenClicked={() => editmodal({prop: industry})} />
        </div>
    )
}

function editmodal({prop}) {
    console.log("edit modal" + prop.industryname);
}


function IndustryCard({prop, whenClicked}) {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Industry Name</h2>
            <p className="text-gray-600">Brief description of the industry.</p>
            <p className="text-gray-600">Number of companies in the industry. {prop.industryname}</p>
            <p className="text-gray-600">Number of jobs in the industry. {prop.description}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4" onClick={whenClicked}>View Companies</button>
        </div>
    )
}