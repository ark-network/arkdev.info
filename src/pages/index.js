import React from 'react';
import styled from 'styled-components';
import Buttons from './Buttons'; // Assuming Buttons is a component you have already created.

// Global styles for consistent branding
const theme = {
  primary: '#f7931a',
  background: '#1a1a1a',
  text: '#f5f5f5',
  border: '#333333',
  footer: '#0e0e0e'
};

// Common styled components for reused styles
const Heading = styled.h1`
  font-family: 'Courier New', Courier, monospace;
  color: ${theme.primary};
`;

const Text = styled.p`
  font-family: 'Arial', sans-serif;
  color: ${theme.text};
`;

// Styled-components for specific layout and elements
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background-color: ${theme.background};
  color: ${theme.text};
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px 0;
  margin: '50px 0';
`;

const BoxSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 50px 0;
`;

const Box = styled.div`
  flex-basis: calc(25% - 40px);
  margin: 20px;
  padding: 40px;
  border: 1px solid ${theme.border};
  border-radius: 10px;
  background-color: ${theme.background};
  &:hover {
    background-color: ${theme.border};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 40px 0;
  background-color: ${theme.footer};
`;

function App() {
  return (
    <Container>
      <Hero>
        <Heading>Welcome to Ark</Heading>
        <Text>A second-layer solution designed to scale Bitcoin transactions</Text>
        <Buttons />
      </Hero>

      <BoxSection>
        {['Learn about Ark', 'Use Ark', 'Integration Tutorials', 'Follow on GitHub and Telegram'].map((title, index) => (
          <Box key={index}>
            <Heading as="h2">{title}</Heading>
            <Text>Information about {title}...</Text>
          </Box>
        ))}
      </BoxSection>

      <Footer>
        <Text>Classic footer links...</Text>
      </Footer>
    </Container>
  );
}

export default App;
