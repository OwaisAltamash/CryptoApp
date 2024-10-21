import { Box, Button, Container, HStack, Radio, RadioGroup, VStack, Text, Image, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Badge, Progress, } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {server} from "../index";
import Loader from './Loader';
import {useParams} from 'react-router-dom';
import ErrorComponent from './ErrorComponent';
import Chart from "./Chart";

const CoinDetails = () => {

  const [Coins, setCoins] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setchartArray] = useState([]);
  const currencySymbol = currency==="inr"?"₹":currency==="eur"?"€":"$"

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"]

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h")
        setLoading(true)
        break;

      case "7d":
        setDays("7d")
        setLoading(true)
        break;

      case "14d":
        setDays("14d")
        setLoading(true)
        break;

      case "30d":
        setDays("30d")
        setLoading(true)
        break;

      case "60d":
        setDays("60d")
        setLoading(true)
        break;

      case "200d":
        setDays("200d")
        setLoading(true)
        break;

      case "1y":
        setDays("365d")
        setLoading(true)
        break;

      case "max":
        setDays("max")
        setLoading(true)
        break;

      default:
        case "24h":
        setDays("24h")
        setLoading(true)
        break;
    }
  }

  const params = useParams()

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const {data} = await axios.get(`${server}/coins/${params.id}`);

        const {data:chartData} = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setCoins(data);
        setchartArray(chartData.prices);
        setLoading(false);
      } catch (error) {
        setError(true)
        setLoading(false); 
      }
    };

    fetchCoins();
  }, [params.id, currency, days]);

  if(error) return <ErrorComponent Message={"Error While Fetching Coins"} />



  return (
    <Container maxW={"container.xl"}>
      {
        loading? <Loader /> : (
          <>
            <Box w={"full"} borderWidth={1}>
              <Chart arr={chartArray} currency={currencySymbol} days={days}/>
            </Box>

            <HStack p={"4"} overflowX={"auto"}>
              {
                btns.map((i) => (
                  <Button key={i} onClick={()=>switchChartStats(i)}>{i}</Button>
                ))
              }
            </HStack>

            <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                <HStack spacing={"4"} >
                  <Radio value={"inr"}>INR</Radio>
                  <Radio value={"usd"}>USD</Radio>
                  <Radio value={"eur"}>EUR</Radio>
                </HStack>
              </RadioGroup>

              <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
                <Text fontSize={"small"} alignSelf="center" opacity={0.7}>
                  Last Updated on {Date(Coins.market_data.last_updated).split("G")[0]}
                </Text>

                <Image src={Coins.image.large} w={"16"} h={"16"} objectFit={"contain"}/>

                <Stat>
                  <StatLabel>{Coins.name}</StatLabel>
                  <StatNumber>{currencySymbol}{Coins.market_data.current_price[currency]}</StatNumber>
                  <StatHelpText>
                    <StatArrow 
                      type= {
                        Coins.market_data.price_change_percentage_24h > 0
                          ? "increase"
                          : "decrease"
                      }
                    />
                    {Coins.market_data.price_change_percentage_24h}%
                  </StatHelpText>
                </Stat>

                <Badge 
                  fontSize={"2xl"} 
                  bgColor={"blackAlpha.800"} 
                  color={"white"}
                >
                  {`#${Coins.market_cap_rank}`}
                </Badge>

                <CustomBar 
                  high={`${currencySymbol}${Coins.market_data.high_24h[currency]}`}
                  low={`${currencySymbol}${Coins.market_data.low_24h[currency]}`}
                />

                <Box w={"full"} p="4" >
                  <Item 
                    title={"max supply"} 
                    value={Coins.market_data.max_supply}
                  />

                  <Item 
                    title={"Circulating supply"} 
                    value={Coins.market_data.circulating_supply}
                  />

                  <Item 
                    title={"Market Cap"} 
                    value={`${currencySymbol}${Coins.market_data.market_cap[currency]}`} 
                  />

                  <Item 
                    title={"All Time Low"} 
                    value={`${currencySymbol}${Coins.market_data.atl[currency]}`} 
                  />

                  <Item 
                    title={"All Time High"} 
                    value={`${currencySymbol}${Coins.market_data.ath[currency]}`} 
                  />
                </Box>

              </VStack>

          </>
        )
      }
    </Container>
  )
}

const Item = ({title, value}) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
    <Text>{value}</Text>
  </HStack>
)

const CustomBar = ({high, low}) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"}/>
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);

export default CoinDetails;