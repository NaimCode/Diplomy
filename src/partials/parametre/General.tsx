import { useTranslation } from "next-i18next"
import Upload from "../../components/Upload"

const General = () => {
  const {t}=useTranslation()
  const text=(s:string)=>t('workspace.parametre'+s)
  return (
    <div>
       <Upload label={text('logo')}/>
    </div>
  )
}

export default General