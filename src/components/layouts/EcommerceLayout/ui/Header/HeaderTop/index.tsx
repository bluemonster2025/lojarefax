"use client";

import { Text } from "@/components/elements/Texts";
import { LinkExternal } from "@/components/elements/LinkExternal/LinkExternal";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";

export default function HeaderTop() {
  return (
    <div className="bg-refax-variable">
      <Section>
        <div className="flex justify-between">
          <div className="flex gap-8">
            {/* Horário */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8C14 4.6875 11.3125 2 8 2Z"
                  stroke="white"
                  strokeMiterlimit="10"
                />
                <path
                  d="M8 4V8.5H11"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text
                variant="mini-default"
                className="text-default-white text-xs uppercase"
              >
                Seg/Sex 07h30m às 17h15m
              </Text>
            </div>
            {/* Contato */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <mask
                  id="mask0_459_432"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="14"
                  height="14"
                >
                  <path d="M0.25 0.25H13.75V13.75H0.25V0.25Z" fill="white" />
                </mask>

                <g mask="url(#mask0_459_432)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0496 8.33989C9.88198 8.25608 9.06016 7.85221 8.90716 7.79596C8.75416 7.73971 8.64279 7.71271 8.53085 7.88033C8.41948 8.04739 8.09941 8.42371 8.0021 8.53508C7.90423 8.64702 7.80691 8.66052 7.63985 8.57727C7.47279 8.49289 6.93391 8.31683 6.29548 7.74758C5.79879 7.30433 5.46298 6.75702 5.36566 6.58939C5.26835 6.42233 5.35498 6.33177 5.43879 6.24852C5.51416 6.17371 5.60585 6.05333 5.68966 5.95602C5.77348 5.85871 5.80104 5.78839 5.85673 5.67646C5.91298 5.56508 5.88485 5.46777 5.84266 5.38396C5.80104 5.30014 5.46691 4.47721 5.32741 4.14252C5.19185 3.81683 5.05404 3.86127 4.95166 3.85564C4.85379 3.85114 4.74241 3.85002 4.63104 3.85002C4.51966 3.85002 4.33854 3.89164 4.18554 4.05927C4.03197 4.22633 3.60054 4.63077 3.60054 5.45371C3.60054 6.27608 4.19904 7.07089 4.28285 7.18283C4.36666 7.29477 5.46129 8.98283 7.1381 9.70677C7.53748 9.87889 7.84854 9.98183 8.09098 10.0583C8.49148 10.186 8.85598 10.168 9.14398 10.1247C9.4646 10.0769 10.1329 9.72027 10.2724 9.32989C10.4119 8.93952 10.4113 8.60483 10.3697 8.53508C10.328 8.46533 10.2167 8.42371 10.049 8.33989M6.99916 12.5041H6.99691C6.00097 12.5043 5.02331 12.2365 4.16641 11.729L3.96391 11.6086L1.85904 12.161L2.42097 10.109L2.28879 9.89858C1.73196 9.01229 1.4373 7.98652 1.43885 6.93983C1.43997 3.87421 3.9341 1.38008 7.00141 1.38008C7.73197 1.37786 8.45569 1.52088 9.13049 1.80082C9.80529 2.08077 10.4177 2.49205 10.9322 3.01077C11.4499 3.52619 11.8603 4.13919 12.1396 4.8143C12.4188 5.48941 12.5613 6.2132 12.5589 6.94377C12.5578 10.0094 10.0637 12.5041 6.99916 12.5041ZM11.7309 2.21202C11.1111 1.58836 10.3738 1.09382 9.56157 0.757045C8.74936 0.420267 7.87842 0.247933 6.99916 0.250019C3.31254 0.250019 0.311037 3.25096 0.309912 6.93927C0.308097 8.11308 0.616024 9.26659 1.2026 10.2833L0.253662 13.75L3.79966 12.8196C4.78076 13.3537 5.8799 13.6337 6.99691 13.6341H6.99973C10.6864 13.6341 13.6879 10.6332 13.689 6.94433C13.6917 6.06529 13.5201 5.19444 13.1841 4.38214C12.8481 3.56985 12.3544 2.83225 11.7315 2.21202"
                    fill="white"
                  />
                </g>
              </svg>

              <Text
                variant="mini-default"
                className="text-default-white text-xs uppercase"
              >
                (11) 98408-4445
              </Text>
            </div>
            {/* Email */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2.66667 3.33337H13.3333C13.7 3.33337 14 3.63337 14 4.00004V12C14 12.3667 13.7 12.6667 13.3333 12.6667H2.66667C2.3 12.6667 2 12.3667 2 12V4.00004C2 3.63337 2.3 3.33337 2.66667 3.33337Z"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 4.33337L8 8.00004L14 4.33337"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <Text
                variant="mini-default"
                className="text-default-white text-xs uppercase"
              >
                loja@refax.com.br
              </Text>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="flex gap-2">
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Instagram"
            >
              <Icon name="FaInstagram" color="#ffff" size={16} />
            </LinkExternal>
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Facebook"
            >
              <Icon name="FaFacebookF" color="#ffff" size={16} />
            </LinkExternal>
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Youtube"
            >
              <Icon name="AiOutlineYoutube" color="#ffff" size={20} />
            </LinkExternal>
          </div>
        </div>
      </Section>
    </div>
  );
}
