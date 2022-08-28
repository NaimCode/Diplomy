import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPropsTranslations = async (locale: string,page:string) => {
      return {
         ...(await serverSideTranslations(locale, [page])),
      }
}