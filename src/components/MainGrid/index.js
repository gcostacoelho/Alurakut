import styled from 'styled-components'
const MainGrid= styled.main`
  width:100%;
  grid-gap: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
  display: grid;
  grid-template-areas: "profileArea welcomeArea socialArea";
  grid-template-columns: 160px 1fr 312px;
`; 

export default MainGrid;