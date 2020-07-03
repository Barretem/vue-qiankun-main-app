import defaultSettings from '@/settings'

const title = defaultSettings.title || 'SPaaS Console'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
