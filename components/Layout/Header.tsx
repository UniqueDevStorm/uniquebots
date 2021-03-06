import Link from 'next/link'
import React from 'react'
import Dropdown from '../Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Header = ({ user, loginURL }: { user: any; loginURL: string }) => {
  const dropdownItemClass =
    'rounded-md p-2 dark:hover:bg-gray-600 cursor-pointer transition-all hover:bg-gray-100'

  const router = useRouter()

  return (
    <div
      className="mx-auto py-2 dark:bg-discord-black dark:text-white fixed top-0 left-0 w-full bg-white z-50"
      style={{ alignItems: 'center' }}
    >
      <div className="flex container mx-auto">
        <div
          className="text-2xl f-jalnan flex-grow flex pl-2"
          style={{ alignItems: 'center' }}
        >
          <Link href="/">UNIQUEBOTS</Link>
        </div>
        <div style={{ alignItems: 'center' }} className="flex pr-2">
          {(() => {
            if (user)
              return (
                <Dropdown
                  button={({ opened }) => (
                    <div
                      className="inline-flex select-none cursor-pointer"
                      style={{ alignItems: 'center' }}
                    >
                      <div className="h-6 w-6 relative mr-2">
                        <Image
                          src={user.avatarURL}
                          className="rounded-full"
                          alt="Avatar"
                          layout="fill"
                        />
                      </div>
                      <span className="md:block hidden">{user.tag}</span>
                      <FontAwesomeIcon
                        icon={['fas', 'angle-down']}
                        size="2x"
                        className={clsx('ml-2 transition-transform', {
                          'fa-rotate-180': opened,
                        })}
                      />
                    </div>
                  )}
                >
                  {({ close }) => (
                    <div className="flex flex-col gap-1" onClick={close}>
                      <Link href="/profile/[id]" as={`/profile/${user.id}`}>
                        <div className={dropdownItemClass}>프로필</div>
                      </Link>
                      <Link href="/addbot">
                        <div className={dropdownItemClass}>봇 추가하기</div>
                      </Link>
                      <Link
                        href={`/logout?path=${encodeURIComponent(
                          router.asPath,
                        )}`}
                      >
                        <div className={dropdownItemClass}>로그아웃</div>
                      </Link>
                    </div>
                  )}
                </Dropdown>
              )
            return (
              <a
                href={loginURL + `&state=${encodeURIComponent(router.asPath)}`}
              >
                로그인
              </a>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default Header
