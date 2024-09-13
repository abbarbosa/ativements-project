import React from 'react'

import { ButtonTransparent } from "../Button"

const Table = ({ list, setList, setUpdate }) => {

  const removeAtivement = (ativo) => {
    try {
      const data = {
        ...ativo,
        status: !ativo.status
      }

      return fetch("http://localhost:3000/ativos/" + ativo.id), {
        method: "PUT",
        body: JSON.stringify(data)
      }
      setList(list.map(item => item.id === ativo.id ? data : item))

    } catch (error) {
      alert("nao foi possivel remover o ativo")
    }
  }

const getAtivement = (ativo) =>{
setUpdate({...ativo})
}

  return (
    <table className='w-full mt-10'>
      <thead>
        <tr className='rounded bg-[#e1e0e7]'>
          <th className='py-5 px-10 text-left'>Identificação do ativo</th>
          <th className='py-5 px-10 text-left'>Nome do ativo</th>
          <th className='py-5 px-10 text-left'>Data do registro</th>
          <th className='py-5 px-10 text-left'>Ações do ativo</th>
        </tr>
      </thead>

      <tbody>
        {
          list.map((item, index) => {
            return (
              <tr key={index} className='hover:bg-[#f1f0f5] hover:last:border-l-2 hover:border-primary-purple'>
                <td className={`py-5 px-10 text-left ${!item.status && "line-through"}`}>{item.numero}</td>
                <td className={`py-5 px-10 text-left ${!item.status && "line-through"}`}>{item.nome}</td>
                <td className={`py-5 px-10 text-left ${!item.status && "line-through"}`}>{item.dataRegistro}</td>
                <td className='py-5 px-10 text-left flex gap-5 '>
                  <ButtonTransparent onClick={e => getAtivement(item)} type="button" styles="border-none py-0 px-0 text-[#009e9e]">Editar ativo</ButtonTransparent>

                  <ButtonTransparent onClick={e => removeAtivement(item)} styles="border-none py-0 px-0 text-primary-red">Remover ativo</ButtonTransparent>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export default Table
