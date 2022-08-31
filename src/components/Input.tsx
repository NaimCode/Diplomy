/* eslint-disable @typescript-eslint/ban-types */
import { useTranslation } from 'next-i18next'
import React, { ReactNode } from 'react'

type TSetValue = (a: string) => void;
type TypeProps={
    icon?:ReactNode,
    required?:boolean,
    placeholder:string,
    className?:string,
    type?:string
    value:string,
    setValue?:TSetValue,
    labelClassName?:string,
    readOnly?:boolean,
    hoverable?:boolean,
    border?:boolean,
    tooltip?:boolean,
    size?:'lg'|'sm'|'md'
}
const Input = ({tooltip="false",size="md",value,setValue,border,readOnly,hoverable=true, icon,type="text",required=false,placeholder,className,labelClassName="input-group-lg"}:TypeProps) => {
    const {t} =useTranslation()
  return (
    <label className={`input-group ${labelClassName} ${hoverable&&"transition-all hover:scale-105"}`}>
    <span className={`${!icon&& "hidden"}`}>
      {icon}
    </span>

    <input
      type={type}
      required={required}
      value={value}
      readOnly={readOnly}
      data-tip={value}
      onChange={ (e)=>setValue!(e.target.value)}
      onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
       onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
      placeholder={t(placeholder)}
      className={`input flex-grow w-full text-ellipsis focus:input-secondary border-2 ${border&&"input-bordered"} ${className} ${tooltip&&"tooltip"}`}
    />
  </label>
  )
}

export default Input