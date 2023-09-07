import Head from 'next/head';
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Box, useDisclosure, HStack, InputGroup, InputRightElement, useColorModeValue, Tag, Input, Text, SimpleGrid, Button, Flex, Center, Stack, Img, VStack } from '@chakra-ui/react';

export async function getServerSideProps(context){

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
export default function Home( {pokemonData} ) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [moves, setMoves] = useState([])
  const [count, setCount] = useState(50)
  const [name, setName] = useState("")
  const [types, setTypes] = useState([])
  const [species, setSpecies] = useState("")
  const [desc, setDesc] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [number, setNumber] = useState("")  
  const [searchText, setSearch] = useState("")

  async function populateInfo(pokeName){

    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`).then(res => res.json()).then(data => {
      console.log(data);
      
      const pokeTypes=[];
      const pokeMoves=[];
      data.types.forEach((val) => {
        pokeTypes.push(val.type.name)
      })

      for (let i=0; i<4; i++){
        pokeMoves.push(data.moves[i].move.name.replace("-", " ").toUpperCase())
      }
      console.log(pokeMoves);
      setMoves(pokeMoves);
      setTypes(pokeTypes);
      setName(pokeName);
      //setSpecies(pokeData.species);
      //setDesc(pokeData.description);
      setWeight(data.weight);
      setHeight(data.height);
      setNumber(data.id);
      onOpen();
    })
  }

  function searchPokemon(){
    const toFind=searchText.toLowerCase();
    let foundName = pokemonData.find((pokemon) => pokemon["name"]===toFind);
    
    if (foundName==undefined){
      foundName = pokemonData.find((pokemon) => pokemon["name"].includes(toFind));
    }
    
    //Show that pokemon is not found
    if (foundName==undefined){
      return;
    }

    populateInfo(foundName['name']);
  }

  //A function that loads more pokemon
  async function loadMore(){

    setCount(count+40)
  }

  return (
    
    <>

      <Head>
        <title>PokeArt</title>
      </Head>

      <Box bgColor={"#bdde7b"} h={"100vh"} overflowY={'scroll'} pb={20}>
        <Center mt={20}>
          <VStack>
            <Text fontSize={40} fontWeight={"bold"} color={"#0e0e0e"}>Search for a pokemon!</Text>
            
            <InputGroup size='md'>
              <Input
                value={searchText} onChange={(e)=>setSearch(e.target.value)}
                type={'text'}
                backgroundColor={"white"} borderColor={"black"} borderWidth={4} color={"#0e0e0e"} focusBorderColor='black' placeholder="Search for a Pokemon by their name" 
              />
              <InputRightElement width='4.5rem' mr={2}>
                <Button h='1.75rem' size='sm' onClick={searchPokemon} colorScheme='green'>Search</Button>
              </InputRightElement>
            </InputGroup>
            
          </VStack>
          
          
        </Center>
        <SimpleGrid minChildWidth='130px' spacing='33px' px={"10%"} my={"3%"}>
  
          {pokemonData && pokemonData.slice(0, count).map((item, index) => (
  
              <Box pos={"relative"} p={5} textAlign="center" key={index} onClick={() => populateInfo(item.name)} border={"2px dashed #739c39"} borderRadius={5}>
                <Center>
                  <Img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`}/>
                </Center>
                <Text fontSize={"14px"} fontWeight={"bold"} color={"black"}>{item.name.toUpperCase()}</Text>
        
                <Text color={"#111111"} pos={"absolute"} fontSize={"1.7ch"} top={2} left={3}>{index+1}.</Text>
           </Box>
              
            )
          )}
        </SimpleGrid>
        <Center>
          <Button color={"white"} bgColor={"#186a31"} _hover={{bg: "#31944a"}} onClick={loadMore}>Load More!</Button>
        </Center>
      </Box>
      

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"#739c39"}>
          <ModalHeader color={"black"}>{number}. {name.toUpperCase()}
          
                {types.map((item, index) => (
                  <Tag bgColor={"#b4de73"} color={"black"} mt={1} key={index} ml={2}>{item}</Tag>
                ))}
              
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center mt={"-22px"}>
              <Img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`}/>
            </Center>

            <Center>
              <Text color={"black"}>Weight: {weight}lbs.</Text>
              <Text color={"black"} ml={5}>Height: {height}ft.</Text>
            </Center>
            
            <Center mt={5} mb={2}>
              <Text fontSize={"2xl"} fontWeight={"bold"}>Possible Moveset:</Text>
            </Center>

            <SimpleGrid columns={2} spacing={6}>
              {moves.map((item, index) => (
                <Box textAlign={"center"} bgColor={"#deff8b"} borderRadius={10} padding={5}>
                  <Text color={"black"} key={index}>{item}</Text>
                </Box>
                
              ))}
            </SimpleGrid>
            
            
            
            
          </ModalBody>

          <ModalFooter>
            <Button bgColor='#186a31' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  )
}
