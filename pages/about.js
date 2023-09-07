import React from 'react';
import Head from 'next/head';
import { Container, Flex, Text, Input } from "@chakra-ui/react";

export default function About() {
  return (
    <>
        <Head>
          <title>About - PokeArt</title>
        </Head>
        <Container maxW={"2xl"} mt={"55px"}>
          <Text fontSize={"lg"}>Thanks </Text>
        </Container>
    </>
  )
}
