import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import { gql } from 'apollo-boost'
import { NextPage, NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import React from 'react'
import { getApolloClient } from '../../../../lib/apollo'
import { getMarkdown } from '../../../../lib/markdown'
import { Bot } from '../../../../types'

const BotInfo: NextPage<{ bot: Bot, me: {id: string} }> = ({ bot, me }) => {
  return (
    <div>
      <NextSeo
        openGraph={{
          description: bot.brief,
          images: [
            {
              url: bot.avatarURL,
            },
          ],
        }}
        title={bot.name}
        description={bot.description}
      />
      <div className="flex flex-col md:flex-row gap-2">
        <img
          src={bot.avatarURL}
          alt="avatar"
          className="md:w-56 md:h-56 w-3/4 mx-auto"
        />
        <div className="flex-grow">
          <div className="text-3xl">
            {bot.name}
            {bot.trusted ? (
              <div className="ml-2 inline-block">
                <Tippy content="UniqueBots에서 인증받은 봇입니다.">
                  <div>
                    <FontAwesomeIcon
                      className="text-blue-500"
                      icon={['fas', 'check']}
                    />
                  </div>
                </Tippy>
              </div>
            ) : null}
          </div>
          <div className="text-xl">{bot.brief}</div>
        </div>
        <div className="md:w-1/4 lg:w-1/5 flex flex-col gap-2">
          <div>
            {bot.invite ? (
              <a
                href={bot.invite}
                target="_blank"
                className="bg-gray-100 dark:bg-discord-black p-2 flex hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
                style={{ alignItems: 'center' }}
              >
                <FontAwesomeIcon
                  icon={['fas', 'plus-circle']}
                  className="mr-2"
                  size="2x"
                />
                초대하기
              </a>
            ) : (
              <Tippy content="초대링크를 가져올 수 없습니다. 잠금처리된 봇일 수 있습니다.">
                <a
                  className="hover:bg-gray-200 bg-gray-100 dark:bg-discord-black p-2 flex transition-colors cursor-pointer"
                  style={{ alignItems: 'center' }}
                >
                  <FontAwesomeIcon
                    icon={['fas', 'plus-circle']}
                    className="mr-2"
                    size="2x"
                  />
                  초대하기
                </a>
              </Tippy>
            )}
            {bot.website && (
              <a
                href={bot.website}
                target="_blank"
                className="hover:bg-gray-200 bg-gray-100 dark:hover:bg-dark-hover dark:bg-discord-black p-2 flex transition-colors"
                style={{ alignItems: 'center' }}
              >
                <FontAwesomeIcon
                  icon={['fas', 'home']}
                  className="mr-2"
                  size="2x"
                />
                웹사이트
              </a>
            )}
            {bot.git && (
              <a
                href={bot.git}
                target="_blank"
                className="hover:bg-gray-200 bg-gray-100 dark:bg-discord-black p-2 flex dark:hover:bg-dark-hover transition-colors"
                style={{ alignItems: 'center' }}
              >
                <FontAwesomeIcon
                  icon={['fab', 'git-alt']}
                  className="mr-2"
                  size="2x"
                />
                Git
              </a>
            )}
            {bot.owners.find(r=>r.id === me?.id) && (
              <Link href="/bots/edit/[id]" as={`/bots/edit/${bot.id}`}>
                <div
                  className="cursor-pointer hover:bg-gray-200 bg-gray-100 dark:bg-discord-black p-2 flex dark:hover:bg-dark-hover transition-colors"
                  style={{ alignItems: 'center' }}
                >
                  <FontAwesomeIcon
                    icon={['fas', 'cog']}
                    className="mr-2"
                    size="2x"
                  />
                  관리
                </div>
              </Link>
            )}
          </div>
          <div className="dark:bg-discord-black bg-gray-100">
            {bot.discordVerified && (
              <Tippy content="디스코드에서 인증받은 봇입니다.">
                <div className="p-2 w-full">
                  <FontAwesomeIcon
                    className="text-blue-500 mr-2"
                    icon={['fas', 'check']}
                  />
                  디스코드에서 인증됨
                </div>
              </Tippy>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 dark:bg-discord-black p-4">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: getMarkdown().render(bot.description),
          }}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const apollo = getApolloClient(ctx)
  const data = await apollo.query({
    query: gql`
      query($id: String!) {
        bot(id: $id) {
          id
          name
          avatarURL
          guilds
          status
          brief
          trusted
          website
          git
          description
          support
          invite
          isOwner
          owners {
            id
            tag
          }
          discordVerified
          categories {
            id
            name
          }
        }
        me {
          id
        }
      }
    `,
    variables: {
      id: ctx.query.id,
    },
  })
  if (!data.data.bot) {
    return {
      props: {
        error: 404,
      },
    }
  }
  return { props: { bot: data.data.bot, me: data.data.me } }
}

export default BotInfo
