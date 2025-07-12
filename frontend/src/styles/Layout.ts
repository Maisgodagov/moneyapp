import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  background-color: #f8fafc;
  overflow-y: auto;
  max-width: 1100px;
  margin: 0 auto;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const Flex = styled.div<{ direction?: 'row' | 'column'; align?: string; justify?: string; gap?: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  gap: ${({ gap }) => gap || '1rem'};
`; 