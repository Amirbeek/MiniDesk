import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Section = styled(motion.section)`
  //padding: 4rem 0;
  background-color: ${({ theme }) => theme.secondaryBackground};
`;

const AnimatedSection = ({ children }) => {
  return (
    <Section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </Section>
  );
};

export default AnimatedSection;
