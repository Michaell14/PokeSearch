import Head from 'next/head';
import { useState } from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import { Box, useDisclosure, useColorMode, Link, IconButton, useColorModeValue, Tag, Input, Text, SimpleGrid, Button, Center, Img, VStack } from '@chakra-ui/react';

//Retrieves the initial 1010 pokemon from PokeApi in the server side before the page content is loaded.
export async function getServerSideProps(context){

  //Gathers the names of the 1010 Pokemon existing in PokeApi
  let pokemonData=[]
  await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0').then(res => res.json()).then(data => {
    pokemonData=data
  })

  return{
    props:{
      pokemonData: pokemonData.results, //pokemon list
    }
  }
}

function PokemonDiv( {modalBgColor, index, textColor, item, populateInfo}){
  return(
    <Box _hover={{cursor: "pointer"}} pos={"relative"} p={5} textAlign="center" onClick={() => populateInfo(item.name)} border={`2px dashed ${modalBgColor}`} borderRadius={5}>
      <Center>
        <Img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`}/>
      </Center>
      <Text fontSize={"16px"} color={textColor}>{item.name.toUpperCase()}</Text>
      <Text color={textColor} pos={"absolute"} fontSize={"2ch"} top={2} left={3}>{index+1}.</Text>
    </Box>
  )
}

export default function Home( {pokemonData} ) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("#111111", "#f8f8f8");
  const bodyBgColor = useColorModeValue("#bdde7b", "#575757");
  const modalBgColor = useColorModeValue("#739c39", "#2b2b2b");
  const compColor = useColorModeValue("#b4de73", "#3b3b3b");
  const buttonColor = useColorModeValue("#188f31", "#bcbcbc");

  const [moves, setMoves] = useState([])
  const [count, setCount] = useState(50)
  const [name, setName] = useState("");
  const [types, setTypes] = useState([])
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [number, setNumber] = useState("")  
  const [searchText, setSearch] = useState("")

  //Populates the Modal with the pokemon info whenever a new pokemon is selected
  async function populateInfo(pokeName){

    //Retrieves the data for a specific pokemon such as its weight, height, and attack info
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`).then(res => res.json()).then(data => {
      
      const pokeTypes=[];
      const pokeMoves=[];

      //Adds the type of the pokemon
      data.types.forEach((val) => {
        pokeTypes.push(val.type.name)
      })

      //Finds the first four moves in the pokemon's moveset
      for (let i=0; i<4; i++){
        pokeMoves.push(data.moves[i].move.name.replace("-", " ").toUpperCase())
      }

      //Setting the modal data
      setMoves(pokeMoves);
      setTypes(pokeTypes);
      setName(pokeName);
      setWeight(data.weight);
      setHeight(data.height);
      setNumber(data.id);
      onOpen();
    })
  }

  //Loads more Pokemon onto the main screen
  async function loadMore(){
    setCount(count+40)
  }

  return (
    
    <>
      <Head>
        <title>PokeSearch</title>
      </Head>
      
      <Box bgColor={bodyBgColor} h={"100vh"} overflowY={'scroll'} pb={20} pos={"relative"}>
        <IconButton pos={"absolute"} top={10} right={10} bgColor={buttonColor} onClick={toggleColorMode} aria-label='Change Color Scheme' icon={colorMode === "light" ?  <MoonIcon />: <SunIcon />} />
        <Center mt={20} textAlign={"center"}>
          <VStack>
            <Text fontSize={50} fontWeight={"bold"} color={textColor}>Search for a pokemon!</Text>
            
              <Input
                value={searchText} onChange={(e)=>setSearch(e.target.value)}
                type={'text'}
                backgroundColor={"white"} borderColor={"black"} borderWidth={4} color={"black"} focusBorderColor='black' placeholder="Search for a Pokemon by their name" 
              />
          </VStack>
        </Center>

        {/* Displays basic info for each Pokemon: A picture, the name, and number */}
        <SimpleGrid minChildWidth='130px' spacing='33px' px={"10%"} my={"3%"}>
          {searchText ? (pokemonData.map((item, index) => (
            (item.name.includes(searchText.toLowerCase()) && 
            <PokemonDiv populateInfo={populateInfo} modalBgColor={modalBgColor} key={index} index={index} textColor={textColor} item={item}/> 
            )))) : (pokemonData && pokemonData.slice(0, count).map((item, index) => (
          <PokemonDiv populateInfo={populateInfo} modalBgColor={modalBgColor} key={index} index={index} textColor={textColor} item={item}/> 
        )))}

        </SimpleGrid>

        {!searchText &&
        <Center py={5}>
          <Button color={colorMode==="light"?"white": "black"} bgColor={buttonColor} onClick={loadMore}>Explore More!</Button>
        </Center>}
        <Box>
          <Text fontSize={30} position={'absolute'} right={20} color={textColor}>Made by <Link href="https://www.itsmichael.dev/" target="_blank" color={colorMode==="light"?"teal.500": "red.400"}>Michael.</Link></Text>
        </Box>
      </Box>
      
      {/* Modal includes main information about each Pokemon. We gather this data from https://pokeapi.co/*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={modalBgColor}>
          <ModalHeader color={textColor}>{number}. {name.toUpperCase()}
                {types.map((item, index) => (
                  <Tag bgColor={compColor} color={textColor} mt={1} key={index} ml={2}>{item}</Tag>
                ))}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center mt={"-22px"}>
              <Img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`}/>
            </Center>

            <Center>
              <Text color={textColor}>Weight: {weight}lbs.</Text>
              <Text color={textColor} ml={5}>Height: {height}ft.</Text>
            </Center>
            
            <Center mt={5} mb={2}>
              <Text fontSize={"2xl"} color={textColor}>Possible Moveset:</Text>
            </Center>

            <SimpleGrid columns={2} spacing={6}>
              {moves.map((item, index) => (
                <Box key={index} textAlign={"center"} bgColor={compColor} borderRadius={10} padding={5}>
                  <Text color={textColor}>{item}</Text>
                </Box>
                
              ))}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button bgColor={buttonColor} color={colorMode==="light"?"white":"black"} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  )
}
