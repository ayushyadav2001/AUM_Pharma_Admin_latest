// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
// import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const userPermissions = JSON.parse(localStorage.getItem('permissions') ?? '{}')

  const isSuperAdmin = () => {
    const userRole = localStorage.getItem('role_name') ?? ''

    return userRole === 'Super Admin'
  }

  const canShowMaster = (masterName: any) => {
    if (isSuperAdmin()) {
      return true // Super Admin sees everything
    }

    const masterPermission = userPermissions.find((perm: any) => perm.masterName === masterName)

    return masterPermission ? masterPermission.visible : false
  }

  const canShowSubmenu = (masterName: any, submenuName: any) => {
    if (isSuperAdmin()) {
      return true // Super Admin sees everything
    }

    const masterPermission = userPermissions.find((perm: any) => perm.masterName === masterName)

    if (!masterPermission || !masterPermission.visible) {
      return false // Master item is not visible
    }

    const submenuPermission = masterPermission.submenus.find((submenu: any) => submenu.submenuName === submenuName)

    return submenuPermission ? submenuPermission.visible : false
  }

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
        </SubMenu>
        <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='ri-file-copy-line' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            {dictionary['navigation'].landing}
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            {dictionary['navigation'].pricing}
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            {dictionary['navigation'].payment}
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            {dictionary['navigation'].checkout}
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            {dictionary['navigation'].helpCenter}
          </MenuItem>
        </SubMenu> */}
        {/* <MenuSection label={dictionary['navigation'].appsPages}>
          <SubMenu label={dictionary['navigation'].eCommerce} icon={<i className='ri-shopping-bag-3-line' />}>
            <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <SubMenu label={dictionary['navigation'].products}>
              <MenuItem href={`/${locale}/apps/ecommerce/products/list`}>{dictionary['navigation'].list}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/add`}>{dictionary['navigation'].add}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/category`}>
                {dictionary['navigation'].category}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].orders}>
              <MenuItem href={`/${locale}/apps/ecommerce/orders/list`}>{dictionary['navigation'].list}</MenuItem>
              <MenuItem
                href={`/${locale}/apps/ecommerce/orders/details/5434`}
                exactMatch={false}
                activeUrl='/apps/ecommerce/orders/details'
              >
                {dictionary['navigation'].details}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].customers}>
              <MenuItem href={`/${locale}/apps/ecommerce/customers/list`}>{dictionary['navigation'].list}</MenuItem>
              <MenuItem
                href={`/${locale}/apps/ecommerce/customers/details/879861`}
                exactMatch={false}
                activeUrl='/apps/ecommerce/customers/details'
              >
                {dictionary['navigation'].details}
              </MenuItem>
            </SubMenu>
            <MenuItem href={`/${locale}/apps/ecommerce/manage-reviews`}>
              {dictionary['navigation'].manageReviews}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/ecommerce/referrals`}>{dictionary['navigation'].referrals}</MenuItem>
            <MenuItem href={`/${locale}/apps/ecommerce/settings`}>{dictionary['navigation'].settings}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].academy} icon={<i className='ri-graduation-cap-line' />}>
            <MenuItem href={`/${locale}/apps/academy/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/my-courses`}>{dictionary['navigation'].myCourses}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/course-details`}>
              {dictionary['navigation'].courseDetails}
            </MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].logistics} icon={<i className='ri-car-line' />}>
            <MenuItem href={`/${locale}/apps/logistics/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/logistics/fleet`}>{dictionary['navigation'].fleet}</MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/email`}
            icon={<i className='ri-mail-open-line' />}
            exactMatch={false}
            activeUrl='/apps/email'
          >
            {dictionary['navigation'].email}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/chat`} icon={<i className='ri-wechat-line' />}>
            {dictionary['navigation'].chat}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/calendar`} icon={<i className='ri-calendar-line' />}>
            {dictionary['navigation'].calendar}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/kanban`} icon={<i className='ri-drag-drop-line' />}>
            {dictionary['navigation'].kanban}
          </MenuItem>
          <SubMenu label={dictionary['navigation'].invoice} icon={<i className='ri-bill-line' />}>
            <MenuItem href={`/${locale}/apps/invoice/list`}>{dictionary['navigation'].list}</MenuItem>
            <MenuItem
              href={`/${locale}/apps/invoice/preview/4987`}
              exactMatch={false}
              activeUrl='/apps/invoice/preview'
            >
              {dictionary['navigation'].preview}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/edit/4987`} exactMatch={false} activeUrl='/apps/invoice/edit'>
              {dictionary['navigation'].edit}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/add`}>{dictionary['navigation'].add}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].user} icon={<i className='ri-user-line' />}>
            <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].list}</MenuItem>
            <MenuItem href={`/${locale}/apps/user/view`}>{dictionary['navigation'].view}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='ri-lock-2-line' />}>
            <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].roles}</MenuItem>
            <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].permissions}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].pages} icon={<i className='ri-layout-left-line' />}>
            <MenuItem href={`/${locale}/pages/user-profile`}>{dictionary['navigation'].userProfile}</MenuItem>
            <MenuItem href={`/${locale}/pages/account-settings`}>{dictionary['navigation'].accountSettings}</MenuItem>
            <MenuItem href={`/${locale}/pages/faq`}>{dictionary['navigation'].faq}</MenuItem>
            <MenuItem href={`/${locale}/pages/pricing`}>{dictionary['navigation'].pricing}</MenuItem>
            <SubMenu label={dictionary['navigation'].miscellaneous}>
              <MenuItem href={`/${locale}/pages/misc/coming-soon`} target='_blank'>
                {dictionary['navigation'].comingSoon}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/under-maintenance`} target='_blank'>
                {dictionary['navigation'].underMaintenance}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/404-not-found`} target='_blank'>
                {dictionary['navigation'].pageNotFound404}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/misc/401-not-authorized`} target='_blank'>
                {dictionary['navigation'].notAuthorized401}
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].authPages} icon={<i className='ri-shield-keyhole-line' />}>
            <SubMenu label={dictionary['navigation'].login}>
              <MenuItem href={`/${locale}/pages/auth/login-v1`} target='_blank'>
                {dictionary['navigation'].loginV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/login-v2`} target='_blank'>
                {dictionary['navigation'].loginV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].register}>
              <MenuItem href={`/${locale}/pages/auth/register-v1`} target='_blank'>
                {dictionary['navigation'].registerV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-v2`} target='_blank'>
                {dictionary['navigation'].registerV2}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-multi-steps`} target='_blank'>
                {dictionary['navigation'].registerMultiSteps}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].verifyEmail}>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v1`} target='_blank'>
                {dictionary['navigation'].verifyEmailV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v2`} target='_blank'>
                {dictionary['navigation'].verifyEmailV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].forgotPassword}>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v1`} target='_blank'>
                {dictionary['navigation'].forgotPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v2`} target='_blank'>
                {dictionary['navigation'].forgotPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].resetPassword}>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v1`} target='_blank'>
                {dictionary['navigation'].resetPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v2`} target='_blank'>
                {dictionary['navigation'].resetPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].twoSteps}>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v1`} target='_blank'>
                {dictionary['navigation'].twoStepsV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v2`} target='_blank'>
                {dictionary['navigation'].twoStepsV2}
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].wizardExamples} icon={<i className='ri-git-commit-line' />}>
            <MenuItem href={`/${locale}/pages/wizard-examples/checkout`}>{dictionary['navigation'].checkout}</MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/property-listing`}>
              {dictionary['navigation'].propertyListing}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/create-deal`}>
              {dictionary['navigation'].createDeal}
            </MenuItem>
          </SubMenu>
          <MenuItem href={`/${locale}/pages/dialog-examples`} icon={<i className='ri-tv-2-line' />}>
            {dictionary['navigation'].dialogExamples}
          </MenuItem>
          <SubMenu label={dictionary['navigation'].widgetExamples} icon={<i className='ri-bar-chart-box-line' />}>
            <MenuItem href={`/${locale}/pages/widget-examples/basic`}>{dictionary['navigation'].basic}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/advanced`}>{dictionary['navigation'].advanced}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/statistics`}>
              {dictionary['navigation'].statistics}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/charts`}>{dictionary['navigation'].charts}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/gamification`}>
              {dictionary['navigation'].gamification}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/actions`}>{dictionary['navigation'].actions}</MenuItem>
          </SubMenu>
        </MenuSection> */}

        {/* <MenuSection label={dictionary['navigation'].formsAndTables}>
          <MenuItem href={`/${locale}/forms/form-layouts`} icon={<i className='ri-layout-4-line' />}>
            {dictionary['navigation'].formLayouts}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-validation`} icon={<i className='ri-checkbox-multiple-line' />}>
            {dictionary['navigation'].formValidation}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-wizard`} icon={<i className='ri-git-commit-line' />}>
            {dictionary['navigation'].formWizard}
          </MenuItem>
          <MenuItem href={`/${locale}/react-table`} icon={<i className='ri-table-alt-line' />}>
            {dictionary['navigation'].reactTable}
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-radio-button-line' />}
          >
            {dictionary['navigation'].formELements}
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-table-2' />}
          >
            {dictionary['navigation'].muiTables}
          </MenuItem>
        </MenuSection> */}
        {/* <MenuSection label={dictionary['navigation'].chartsMisc}>
          <SubMenu label={dictionary['navigation'].charts} icon={<i className='ri-bar-chart-2-line' />}>
            <MenuItem href={`/${locale}/charts/apex-charts`}>{dictionary['navigation'].apex}</MenuItem>
            <MenuItem href={`/${locale}/charts/recharts`}>{dictionary['navigation'].recharts}</MenuItem>
          </SubMenu>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-pantone-line' />}
          >
            {dictionary['navigation'].foundation}
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-toggle-line' />}
          >
            {dictionary['navigation'].components}
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-menu-search-line' />}
          >
            {dictionary['navigation'].menuExamples}
          </MenuItem>
          <MenuItem
            href='https://pixinvent.ticksy.com'
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-lifebuoy-line' />}
          >
            {dictionary['navigation'].raiseSupport}
          </MenuItem>
          <MenuItem
            href='https://demos.pixinvent.com/materialize-nextjs-admin-template/documentation'
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-book-line' />}
          >
            {dictionary['navigation'].documentation}
          </MenuItem>
          <SubMenu label={dictionary['navigation'].others} icon={<i className='ri-more-line' />}>
            <MenuItem suffix={<Chip label='New' size='small' color='info' />}>
              {dictionary['navigation'].itemWithBadge}
            </MenuItem>
            <MenuItem
              href='https://pixinvent.com'
              target='_blank'
              suffix={<i className='ri-external-link-line text-xl' />}
            >
              {dictionary['navigation'].externalLink}
            </MenuItem>
            <SubMenu label={dictionary['navigation'].menuLevels}>
              <MenuItem>{dictionary['navigation'].menuLevel2}</MenuItem>
              <SubMenu label={dictionary['navigation'].menuLevel2}>
                <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
                <MenuItem>{dictionary['navigation'].menuLevel3}</MenuItem>
              </SubMenu>
            </SubMenu>
            <MenuItem disabled>{dictionary['navigation'].disabledMenu}</MenuItem>
          </SubMenu>
        </MenuSection> */}

        {/* <MenuSection label={dictionary['navigation'].dashboard}> */}

        {canShowMaster('Home') && (
          <MenuItem href={`/${locale}/dashboards/crm`} icon={<i className=' ri-home-smile-line' />}>
            {dictionary['navigation'].home}
          </MenuItem>
        )}

        {/* </MenuSection> */}

        {/* <MenuItem href={`/${locale}/apps/products`} icon={<i className='ri-layout-4-line' />}>
            {dictionary['navigation'].products}
          </MenuItem> */}

        {canShowMaster('Users') && (
          <SubMenu label={dictionary['navigation'].user} icon={<i className='ri-team-line' />}>
            {canShowSubmenu('Users', 'List User') && (
              <MenuItem href={`/${locale}/apps/users`}>{dictionary['navigation'].userList}</MenuItem>
            )}
            {canShowSubmenu('Users', 'Roles') && (
              <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].rolesList}</MenuItem>
            )}
          </SubMenu>
        )}

        {/* <SubMenu
          label={dictionary['navigation'].user}
          icon={<i className='ri-team-line' />}


        >
          <MenuItem href={`/${locale}/apps/user/list`}  >
            {dictionary['navigation'].userList}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/roles`}  >
            {dictionary['navigation'].rolesList}
          </MenuItem>


        </SubMenu> */}

        <SubMenu label={dictionary['navigation'].masters} icon={<i className='ri-archive-line' />}>
          <MenuItem href={`/${locale}/apps/category`}>{dictionary['navigation'].categorys}</MenuItem>
          {/* <MenuItem href={`/${locale}/apps/category/category-indexing`}>{dictionary['navigation'].indexingCategorys}</MenuItem> */}
          <MenuItem href={`/${locale}/apps/sub-category`}>{dictionary['navigation'].subCategorys}</MenuItem>

          <MenuItem href={`/${locale}/apps/secondary-sub-category`}>{dictionary['navigation'].secondarySubCategories}</MenuItem>
          <MenuItem href={`/${locale}/apps/packaging`}>{dictionary['navigation'].packaging}</MenuItem>
          <MenuItem href={`/${locale}/apps/packaging-type`}>{dictionary['navigation'].packagingType}</MenuItem>
          <MenuItem href={`/${locale}/apps/manufacturer`}>{dictionary['navigation'].manufacturer}</MenuItem>
          <MenuItem href={`/${locale}/apps/product-form`}>{dictionary['navigation'].productForm}</MenuItem>

        </SubMenu>




        {/* <SubMenu label={dictionary['navigation'].subCategorys} icon={<i className='ri-archive-2-line' />}>
        </SubMenu> */}




        {canShowMaster('Products') && (
          <SubMenu
            label={dictionary['navigation'].products}
            icon={<i className='ri-home-smile-line' />}

          // suffix={<Chip label='5' size='small' color='error' />}
          >
            {canShowSubmenu('Products', 'List Product') && (
              <MenuItem href={`/${locale}/apps/products`}>{dictionary['navigation'].productsList}</MenuItem>
            )}

            {canShowSubmenu('Products', 'Add Product') && (
              <MenuItem href={`/${locale}/apps/products/add`}>{dictionary['navigation'].addProducts}</MenuItem>
            )}

            {canShowSubmenu('Products', 'Import Product') && (
              <MenuItem href={`/${locale}/apps/products/import`}>{dictionary['navigation'].importProducts}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Vendors') && (
          <SubMenu
            label={dictionary['navigation'].vendor}
            icon={<i className='ri-group-3-line' />}

          // suffix={<Chip label='5' size='small' color='error' />}
          >
            <MenuItem href={`/${locale}/apps/formats`}>{dictionary['navigation'].formats}</MenuItem>

            {canShowSubmenu('Vendors', 'List Vendor') && (
              <MenuItem href={`/${locale}/apps/vendors`}>{dictionary['navigation'].vendorList}</MenuItem>
            )}

            {canShowSubmenu('Vendors', 'Add Vendor') && (
              <MenuItem href={`/${locale}/apps/vendors/add`}>{dictionary['navigation'].vendorAdd}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Purchases') && (
          <SubMenu label={dictionary['navigation'].purchases} icon={<i className='ri-download-line' />}>
            {canShowSubmenu('Purchases', 'List Purchase') && (
              <MenuItem href={`/${locale}/apps/purchase-orders`}>{dictionary['navigation'].listPurchases}</MenuItem>
            )}

            {canShowSubmenu('Purchases', 'Add Purchase') && (
              <MenuItem href={`/${locale}/apps/purchase-orders/add`}>{dictionary['navigation'].addPurchases}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Orders') && (
          <SubMenu label={dictionary['navigation'].orders} icon={<i className='ri-shape-line' />}>
            {canShowSubmenu('Orders', 'List Order') && (
              <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].userList}</MenuItem>
            )}
            {canShowSubmenu('Orders', 'Add Order') && (
              <MenuItem href={`/${locale}/apps/vendors/roles`}>{dictionary['navigation'].rolesList}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Stocks') && (
          <SubMenu label={dictionary['navigation'].stock} icon={<i className='ri-funds-box-line' />}>
            {canShowSubmenu('Stocks', 'List Stock') && (
              <MenuItem href={`/${locale}/apps/stock`}>{dictionary['navigation'].stockList}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Stocks Adjustment') && (
          <SubMenu label={dictionary['navigation'].stockAdjustment} icon={<i className='ri-database-2-line' />}>
            {canShowSubmenu('Stocks Adjustment', 'List Stock Adjustment') && (
              <MenuItem href={`/${locale}/apps/stock-adjustment`}>
                {dictionary['navigation'].listStockAdjustment}
              </MenuItem>
            )}
            {canShowSubmenu('Stocks Adjustment', 'Add Stock Adjustment') && (
              <MenuItem href={`/${locale}/apps/stock-adjustment/add`}>
                {dictionary['navigation'].addStockAdjustment}
              </MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Reports') && (
          <SubMenu label={dictionary['navigation'].reports} icon={<i className='ri-folder-chart-line' />}>
            {canShowSubmenu('Reports', 'List Report') && (
              <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].userList}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Notification Template') && (
          <SubMenu label={dictionary['navigation'].notificationTemplate} icon={<i className='ri-mail-line' />}>
            {canShowSubmenu('Notification Template', 'List Template') && (
              <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].userList}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Settings') && (
          <SubMenu label={dictionary['navigation'].setting} icon={<i className='ri-settings-5-line' />}>
            {canShowSubmenu('Settings', 'General Settings') && (
              <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].userList}</MenuItem>
            )}
          </SubMenu>
        )}

        {canShowMaster('Customers') && (
          <MenuItem href={`/${locale}/apps/customers`} icon={<i className='ri-user-follow-line' />}>
            {dictionary['navigation'].customers}
          </MenuItem>
        )}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
