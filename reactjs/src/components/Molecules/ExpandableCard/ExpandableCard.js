import { Card, CardHeader, CardContent } from '@mui/material'
import data from '../../../mockData/mockLawData'


const ExpandableCard = () => {
    const firstLaw = data['2a67fafc-14eb-4b24-b77d-9cc070aeef08']

    console.log(firstLaw)
    return (
        <div style={{height: 300, width: 1000 }}>
        <Card>
            <CardHeader >{firstLaw.title}</CardHeader>
            <CardContent>{firstLaw.versions[1].content}</CardContent>
        </Card>
        </div>
    
    )
}

export default ExpandableCard