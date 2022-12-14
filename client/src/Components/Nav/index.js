import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import {
	FaSun,
	FaMoon,
	FaInstagram,
	FaGithub,
	FaLinkedin,
} from "react-icons/fa";
import { IconButton } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Heading, VStack, Flex } from "@chakra-ui/react";

function Nav() {
	const { colorMode, setToggleMode } = useColorMode();
	const darkMode = colorMode === "dark";
	return (
		<VStack p={5}>
			<Flex w='100%'>
				<Heading ml='8' size='md' fontWeight='semibold' color='blackAlpha.600'>
					TESTING
				</Heading>
			</Flex>
			<IconButton
				ml={8}
				icon={darkMode ? <FaSun /> : <FaMoon />}
				isRound='true'
				onClick={setToggleMode}
			/>
		</VStack>
	);
}

export default Nav;
