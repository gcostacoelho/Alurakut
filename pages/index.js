//Para rodar eu uso o "npm run dev"
import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/socialAreaStyles';
import { render } from 'react-dom';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props){
  const [comunidades, setComunidades]=React.useState([]);
  const usuarioAleatorio= props.githubUser;
  const amigos = ['omariosouto', 'Rafaballerini', 'fabiocruzcoelho', 'Diolinux', 'peas']
  const [seguidores, setSeguidores]=React.useState([]);
  //GET
  React.useEffect(function(){
    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
    .then(function(valorRecebido){
      return valorRecebido.json();
    })
    .then(function(valorCompleto){
      setSeguidores(valorCompleto);
    })

    //API GraphQL - POST && GET
    fetch('https://graphql.datocms.com/',{
      method: 'POST',
      headers: {
        'Authorization': 'fc597ddea30fec2dd9ad46e58fdcc4',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify ({"query":`query {
        allCommunities {
          id
          title
          image
          url
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta)=>{
      const comunidadesCMS = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesCMS)
    })
  }, [])
  
  return(
    <>
      <AlurakutMenu/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box className="tittle">
            <h1>
              Bem-Vindo, {usuarioAleatorio}
            </h1>
            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
            <h2 className="subTitle">O que você vai fazer?</h2>
            <form onSubmit={function handleCreate(event){
              event.preventDefault();
              const dadosSalvos= new FormData(event.target);

              const comunidade={
                title: dadosSalvos.get('title'),
                image: dadosSalvos.get('image'),
                url: dadosSalvos.get('url'),
                creatorSlug: usuarioAleatorio
              }

              fetch('/api/communities', {
                method:'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados.register);
                const comunidade= dados.register;             
                const comunidadeAtualizada = [...comunidades, comunidade]
                setComunidades(comunidadeAtualizada)
              })
            }}>
              <div>
                <input 
                  placeholder= "Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder= "Faça o upload da imagem" 
                  name="image" 
                  aria-label="Faça o upload da imagem"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque o link da sua comunidade"
                  name="url"
                  aria-label="Coloque o link da sua comunidade"
                />
              </div>
              <button className="button">
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="socialArea" style={{ gridArea: 'socialArea'}}>
          {/*Seguidores*/}
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>
          {/*Amigos*/}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Amigos ({amigos.length})  <a className='boxLink' href=''> Ver todos</a>
            </h2>
            <ul>
              {amigos.map((itemAtual)=> {
                return(
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}` && `https://github.com/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`}/>                    
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                ) 
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          {/*Comunidades*/}
          <Box>
            <h3 className="smallTitle">
              Comunidades ({comunidades.length}) <a className='boxLink' href=''> Ver todos</a>
            </h3>
            <ProfileRelationsBoxWrapper>
              <ul>
                {comunidades.map((itemAtual)=> {
                  return(
                    <li key={itemAtual.id}>
                      <a href={`/users/${itemAtual.title}` && `${itemAtual.url}`}>
                        <img src={itemAtual.image}/>
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  ) 
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const {githubUser} = jwt.decode(token);

  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta)=> resposta.json())

  if(isAuthenticated===false){
    return{
      redirect:{
        destination: '/login',
        permanent: false,
      }
    }
  }

  return{
    props: {
      githubUser
    },
  }
}