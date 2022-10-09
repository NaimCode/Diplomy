import { useTranslation } from 'next-i18next'
import React from 'react'


type DialogConfirmationProps={
onConfirm:()=>void
}
const DialogConfirmation = ({onConfirm}:DialogConfirmationProps) => {
 const {t}=useTranslation()
    return <div className="modal" id="confirmation_red">
    <div className="modal-box">
      <h3 className="font-bold text-lg">{t('global.confirmation')}</h3>
      <div className="modal-action">
       <a href="#" className="btn btn-ghost no-underline">{t('global.annuler')}</a>
       <a href="#" onClick={()=>onConfirm()} className="btn btn-error no-underline">{t('global.confirmer')}</a>
      </div>
    </div>
  </div>
  
}

export default DialogConfirmation