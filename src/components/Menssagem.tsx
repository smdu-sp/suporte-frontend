import { Avatar, Box, Card, Typography } from "@mui/joy";
import Img from '@/assets/sis-icon.png'
import Image from "next/image";
interface msg {
    text: string,
    user: string,
    index: boolean
}

export default function Msg(props: msg) {
    return (
        <Box sx={{
            width: '100%',
            p: 1,
            display: 'flex',
            flexDirection: !props.index ? 'row' : 'row',
            alignItems: null,
        }}>
            {
                props.index &&
                <Box sx={{ mr: 2 }}>
                    <Avatar>
                        {
                            props.index ?
                                <Image
                                    src={Img}
                                    alt="Prefeitura"
                                    width={30}
                                />
                                :
                                null
                        }
                    </Avatar>
                </Box>
            }

            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: !props.index ? 'end' : null,
            }}>
                <Typography fontSize={14}>
                    {props.user}
                </Typography>
                <Card sx={{ 
                    maxWidth: 400, 
                    border: 'none', 
                    borderRadius: 15, 
                    borderTopLeftRadius: props.index ? 0 : 15,
                    borderTopRightRadius: !props.index ? 0 : 15}}
                    color={!props.index ? 'primary' : 'neutral'}
                    variant="solid"
                    >
                    {props.text}
                </Card>
            </Box>
            {
                !props.index &&
                <Box sx={{ ml: 2, display: 'flex', alignItems: 'start'}}>
                    <Avatar>
                        {
                            props.index ?
                                <Image
                                    src={Img}
                                    alt="Prefeitura"
                                    width={30}
                                />
                                :
                                null
                        }
                    </Avatar>
                </Box>
            }
        </Box>
    )
}