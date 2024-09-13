import { useContext, useState } from "react";
import { Button, ButtonTransparent } from "../Button";
import { Input, Select } from './../Input/index';
import context from "../../Context/context";

import { v4 as uuid } from "uuid";
import { useEffect } from "react";

export const FormAccess = ({ textButton, onSubmit, value, onChange, load }) => {
  return (
    <form onSubmit={onSubmit} className="w-[40%]">
      <Input styles="w-full" id="campoFormulario" value={value} onChange={onChange}>Usuário de acesso</Input>

      <Button load={load} styles="w-full mt-4">{textButton}</Button>
    </form>
  )
}




export const FormAtivement = ({list, setList, places, setPlaces, update}) => {

  const clearInputs = () =>{
    setAtivement({numero :"" , nome :"" , local:""})
  }



  const uptadeAtivement = async () =>{
    try {
      const localId = await findPlace(ativement.local)
  
      const data = {
        ...ativement,
        local: localId,
        dataAtualizacao : new Date().toLocaleString() , 
        usuarioAlteraca : user.id,
  
      }
  fetch("http:/localhost:3000/ativos/" + ativement.id,{
    method : "PUT",
    body : JSON.stringify(data)
  })
  
  setList(list.map (item => item.id === ativement.id ? data : item))
  
    } catch {
      alert("nao foi possivel atualizar o ativo")
    }
  }
  
  const { user } = useContext(context);
  const [ativement, setAtivement] = useState({
    numero: "",
    nome: "",
    local: ""
  })

  

  const validateData = async (e) =>{
    e.preventDefault()
    const numeracaoEmUso = await validateNumberActivement();
    //quantidade de caracteres maior que 2 - nome
    if (ativement.nome.length <=2 ) {
      alert("nome do ativo com poucos caracteres, obrigatorio  2 ou mais")
    }//quantidade de caracteres maior que 5 - numeracao
    else if(ativement.numero.length <=5){
    alert("numero do ativo com poucos caracteres, obrigatorio ao menos 5")
    } else if(ativement.nome.trim() === "" || ativement.local.trim() === ""){
    alert("campos nao preenchidos corretamente")
    }else if(numeracaoEmUso && !ativement.id){
      alert("numero do ativo ja esta em uso")
    }else{
     if(ativement.id){
      createAtivement()
     } else{
      uptadeAtivement()
     }
    }
    
    }
    const validateNumberActivement = async () =>{
      return fetch("http://localhost:3000/ativos?numero=" + ativement.numero)
      .then(response => response.json()
      .then(response =>{
        if (response[0].id) {
          return true
        }
        return false
      }).catch(() =>{
        return false
      })
      )
    }

  const createAtivement = async () => {
    try {

      const localId = await findPlace(ativement.local)

      const data = {
        ...ativement,
        local: localId,
        id: uuid(),
        usuario_id: user.id,
        dataRegistro: new Date().toLocaleString(),
        status: true
      }

      fetch("http://localhost:3000/ativos", {
        method: "POST",
        body: JSON.stringify(data)
      })

      setList([...list, data])

    } catch {
      alert(" ops")
    }
  }

  const findPlace = (local) => {
    return fetch("http://localhost:3000/locais?nome=" + local)
      .then(response => response.json())
      .then(
        async response => {
          if (!response[0]) {
            return await createPlace(local)
          } else {
            return response[0].id
          }
        }

      )
      .catch(() => {
        alert("Nao foi encontrado nenhum local com essa informacao")

      })
  }

  const createPlace = (local) => {
    try {
      const data = {
        id: uuid(),
        nome: local
      }

      fetch("http://localhost:3000/locais", {
        method: "POST",
        body: JSON.stringify(data)
      })

      setPlaces([...places, data])
      
      return data.id;

    } catch {
      alert("sou eu ")
    }
  }

  useEffect( () =>{
    const local = places.filter(item => item.id === update.local)
    if(local[0]){
      setAtivement({...update, local : local[0].nome})
    }
   
  }, [update])

  return (
    <form onSubmit={validateData} className="bg-[#D9D3F6] w-full py-5 px-10 mt-6 rounded flex justify-between items-end shadow-md">
      <Input disabled={!!ativement.id} type="number" styles="w-[20%]" id="numeroativo" value={ativement.numero} onChange={e => setAtivement({ ...ativement, numero: e.target.value })}>Número do ativo</Input>

      <Input type="text" styles="w-[20%]" id="nomeativo" value={ativement.nome} onChange={e => setAtivement({ ...ativement, nome: e.target.value })}>Nome do ativo</Input>

      <Select places={places} styles="w-[20%]" id="localativo" value={ativement.local} onChange={e => setAtivement({ ...ativement, local: e.target.value })}>Local do ativo</Select>

      <ButtonTransparent  onClick = {e=> clearInputs()} styles="w-[15%] border-primary-blue text-primary-blue">Limpar campos</ButtonTransparent>

      <Button styles="w-[15%]">Inserir ativo</Button>
    </form>
  )
}