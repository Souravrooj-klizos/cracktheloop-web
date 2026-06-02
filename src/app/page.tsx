"use client";

import { useState } from "react";
import { 
  Shield, 
  Zap, 
  Mic, 
  Volume2, 
  Check, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Globe,
  Gauge,
  EyeOff,
  Star,
  Target,
  Trophy,
  Users,
  ChevronDown,
  Cpu,
  MonitorSpeaker,
  BrainCircuit,
  X
} from "lucide-react";

export default function Home() {

  const companies = [
    {
      name: "Google",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45.9997 37.7273V53.2183H67.527C66.5817 58.2002 63.745 62.4186 59.4905 65.2549L72.4724 75.3278C80.036 68.3461 84.3997 58.0914 84.3997 45.9096C84.3997 43.0733 84.1453 40.3457 83.6724 37.7278L45.9997 37.7273Z" fill="#4285F4"/>
          <path d="M23.5822 52.6137L20.6543 54.855L10.2904 62.9276C16.8722 75.9821 30.3622 85.0005 45.9986 85.0005C56.7984 85.0005 65.8529 81.4368 72.4713 75.3278L59.4894 65.255C55.9258 67.655 51.3802 69.1097 45.9986 69.1097C35.5986 69.1097 26.7624 62.0915 23.5985 52.6368L23.5822 52.6137Z" fill="#34A853"/>
          <path d="M10.2906 27.0729C7.56349 32.4545 6 38.5274 6 45C6 51.4727 7.56323 57.546 10.2904 62.9276C10.2904 62.9637 23.6001 52.5998 23.6001 52.5998C22.8001 50.1998 22.3272 47.6545 22.3272 44.9996C22.3272 42.3447 22.8001 39.7994 23.6001 37.3994L10.2906 27.0729Z" fill="#FBBC05"/>
          <path d="M45.9994 20.9274C51.8905 20.9274 57.1268 22.9637 61.3086 26.891L72.7631 15.4366C65.8176 8.96391 56.7997 5 45.9994 5C30.3631 5 16.8725 13.9819 10.2906 27.0729L23.5994 37.4002C26.7629 27.9455 35.5994 20.9274 45.9994 20.9274Z" fill="#EA4335"/>
        </svg>
      )
    },
    {
      name: "Meta",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_1503_2801)">
            <path d="M10.8012 60.803C10.8012 64.6214 11.6393 67.5529 12.7347 69.3265C14.171 71.6495 16.3131 72.6336 18.497 72.6336C21.3138 72.6336 23.8907 71.9346 28.8566 65.0665C32.8349 59.5615 37.5226 51.8345 40.6767 46.9903L46.0182 38.7833C49.7288 33.0836 54.0235 26.7475 58.9477 22.4528C62.9677 18.9474 67.3042 17 71.6685 17C78.9957 17 85.9751 21.2461 91.3166 29.2096C97.1623 37.9313 100 48.9168 100 60.2536C100 66.993 98.6716 71.945 96.4112 75.8573C94.2273 79.6408 89.9708 83.4209 82.8105 83.4209V72.6336C88.9414 72.6336 90.4716 67 90.4716 60.5526C90.4716 51.365 88.3294 41.1689 83.6104 33.8834C80.2615 28.7158 75.9215 25.5582 71.1469 25.5582C65.9828 25.5582 61.8271 29.4531 57.1568 36.3977C54.6738 40.0874 52.1248 44.5838 49.2628 49.6575L46.1121 55.239C39.783 66.461 38.1799 69.017 35.0153 73.2352C29.4686 80.6215 24.7322 83.4209 18.497 83.4209C11.1003 83.4209 6.42301 80.2181 3.52622 75.3913C1.1615 71.4582 0 66.2975 0 60.417L10.8012 60.803Z" fill="#0081FB"/>
            <path d="M8.51953 29.9712C13.4715 22.338 20.6179 17 28.8144 17C33.5613 17 38.2803 18.4049 43.2079 22.4284C48.5981 26.8275 54.343 34.0712 61.5102 46.0096L64.0801 50.2939C70.284 60.6292 73.8137 65.9463 75.8794 68.4536C78.5362 71.6738 80.3967 72.6336 82.8136 72.6336C88.9445 72.6336 90.4746 67 90.4746 60.5526L100.003 60.2536C100.003 66.993 98.6746 71.945 96.4142 75.8573C94.2303 79.6408 89.9738 83.4209 82.8136 83.4209C78.3624 83.4209 74.4188 82.4542 70.058 78.3402C66.7056 75.1826 62.7865 69.5734 59.7714 64.5309L50.8029 49.5497C46.303 42.0313 42.1751 36.4255 39.7861 33.8869C37.2162 31.157 33.9125 27.8603 28.6405 27.8603C24.3736 27.8603 20.75 30.8545 17.7176 35.4344L8.51953 29.9712Z" fill="url(#paint0_linear_1503_2801)"/>
            <path d="M28.6375 27.8603C24.3706 27.8603 20.747 30.8545 17.7146 35.4344C13.4268 41.9061 10.8012 51.5458 10.8012 60.803C10.8012 64.6214 11.6393 67.5529 12.7347 69.3265L3.52622 75.3913C1.1615 71.4582 0 66.2975 0 60.417C0 49.7236 2.93504 38.5781 8.51648 29.9712C13.4685 22.338 20.6148 17 28.8114 17L28.6375 27.8603Z" fill="url(#paint1_linear_1503_2801)"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_1503_2801" x1="1278.17" y1="3732.17" x2="8155.4" y2="4079.51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0064E1"/>
              <stop offset="0.4" stopColor="#0064E1"/>
              <stop offset="0.83" stopColor="#0073EE"/>
              <stop offset="1" stopColor="#0082FB"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1503_2801" x1="1564.89" y1="4850.77" x2="1564.89" y2="2312.17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0082FB"/>
              <stop offset="1" stopColor="#0064E0"/>
            </linearGradient>
            <clipPath id="clip0_1503_2801">
              <rect width="100" height="66.7969" fill="white" transform="translate(0 17)"/>
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      name: "Microsoft",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.7813 10.4535H54.4797L31.9547 77.1926C31.7232 77.8784 31.2824 78.4743 30.6945 78.8965C30.1065 79.3187 29.401 79.5458 28.6772 79.546H11.7905C11.2421 79.546 10.7016 79.4155 10.2136 79.1652C9.72563 78.9149 9.30428 78.552 8.9844 78.1066C8.66452 77.6611 8.4553 77.1459 8.37406 76.6035C8.29281 76.0612 8.34187 75.5073 8.51717 74.9876L29.503 12.8068C29.7344 12.1207 30.1752 11.5245 30.7634 11.1022C31.3515 10.6799 32.0573 10.4535 32.7813 10.4535Z" fill="url(#paint0_linear_897_5761)"/>
          <path d="M64.3131 55.2178H29.9048C29.5849 55.2174 29.2723 55.3134 29.0078 55.4932C28.7432 55.6731 28.539 55.9284 28.4216 56.226C28.3042 56.5236 28.2792 56.8496 28.3498 57.1616C28.4204 57.4737 28.5833 57.7572 28.8173 57.9753L50.9273 78.6119C51.571 79.2124 52.4186 79.5463 53.299 79.5461H72.7823L64.3131 55.2178Z" fill="#0078D4"/>
          <path d="M32.7828 10.4532C32.0508 10.4503 31.3371 10.6816 30.746 11.1133C30.1548 11.5449 29.7172 12.1543 29.497 12.8523L8.54445 74.9306C8.35735 75.4522 8.29861 76.0111 8.3732 76.5601C8.44779 77.1091 8.65352 77.6321 8.97298 78.0848C9.29243 78.5375 9.71623 78.9066 10.2085 79.1609C10.7008 79.4152 11.2471 79.5471 11.8011 79.5457H29.1236C29.7688 79.4304 30.3718 79.1459 30.871 78.7213C31.3703 78.2968 31.7479 77.7473 31.9653 77.129L36.1436 64.8148L51.0686 78.7356C51.6941 79.253 52.4786 79.539 53.2903 79.5457H72.7011L64.1878 55.2173L39.3703 55.2232L54.5595 10.4532H32.7828Z" fill="url(#paint1_linear_897_5761)"/>
          <path d="M60.4949 12.8031C60.2638 12.1182 59.8236 11.5229 59.2364 11.1014C58.6492 10.6798 57.9445 10.453 57.2216 10.4531H33.0391C33.7619 10.4532 34.4666 10.6799 35.0538 11.1015C35.641 11.5231 36.0812 12.1182 36.3124 12.8031L57.2991 74.9865C57.4745 75.5062 57.5237 76.0602 57.4425 76.6027C57.3613 77.1452 57.1521 77.6606 56.8323 78.1062C56.5124 78.5518 56.091 78.9149 55.603 79.1653C55.1149 79.4158 54.5743 79.5464 54.0257 79.5465H78.2091C78.7575 79.5463 79.2981 79.4156 79.786 79.1651C80.2739 78.9146 80.6952 78.5515 81.015 78.1059C81.3348 77.6603 81.5439 77.145 81.625 76.6025C81.7062 76.0601 81.657 75.5061 81.4816 74.9865L60.4949 12.8031Z" fill="url(#paint2_linear_897_5761)"/>
          <defs>
            <linearGradient id="paint0_linear_897_5761" x1="40.6897" y1="15.5735" x2="18.1555" y2="82.1451" gradientUnits="userSpaceOnUse">
              <stop stopColor="#114A8B"/>
              <stop offset="1" stopColor="#0669BC"/>
            </linearGradient>
            <linearGradient id="paint1_linear_897_5761" x1="47.7303" y1="46.5973" x2="42.5178" y2="48.3598" gradientUnits="userSpaceOnUse">
              <stop stopOpacity="0.3"/>
              <stop offset="0.071" stopOpacity="0.2"/>
              <stop offset="0.321" stopOpacity="0.1"/>
              <stop offset="0.623" stopOpacity="0.05"/>
              <stop offset="1" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="paint2_linear_897_5761" x1="44.8616" y1="13.6315" x2="69.5974" y2="79.5323" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3CCBF4"/>
              <stop offset="1" stopColor="#2892DF"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      name: "Amazon",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M74.0932 70.8556C41.0733 86.5701 20.5808 73.4223 7.46285 65.4365C6.65112 64.9332 5.27146 65.5542 6.46851 66.9291C10.8387 72.2281 25.1609 85 43.8555 85C62.563 85 73.6922 74.7925 75.0844 73.0118C76.4672 71.2463 75.4907 70.2723 74.0932 70.8556ZM83.3668 65.7343C82.48 64.5796 77.9749 64.3644 75.1396 64.7127C72.3 65.0509 68.0377 66.7864 68.4083 67.8284C68.5984 68.2187 68.9865 68.0436 70.9373 67.8682C72.8933 67.6731 78.3731 66.9815 79.5149 68.4741C80.662 69.9771 77.7672 77.1367 77.2385 78.2913C76.7276 79.446 77.4336 79.7438 78.3931 78.9747C79.3395 78.206 81.0527 76.2151 82.2024 73.3978C83.3442 70.5651 84.0407 66.6135 83.3668 65.7343Z" fill="#FF9900"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M51.8909 38.7904C51.8909 42.9136 51.9951 46.3522 49.911 50.0139C48.2289 52.9912 45.5643 54.8221 42.5872 54.8221C38.5232 54.8221 36.1565 51.7258 36.1565 47.1561C36.1565 38.1352 44.2392 36.498 51.8909 36.498V38.7904ZM62.5639 64.5872C61.8642 65.2122 60.852 65.2571 60.0631 64.8401C56.5501 61.9226 55.9248 60.5681 53.9897 57.7843C48.1843 63.7089 44.0758 65.4801 36.5436 65.4801C27.6419 65.4801 20.705 59.9873 20.705 48.9869C20.705 40.3981 25.3645 34.5479 31.9883 31.6901C37.7344 29.1592 45.7579 28.7127 51.8909 28.0134V26.6438C51.8909 24.128 52.0842 21.1509 50.6107 18.9778C49.3155 17.0277 46.8445 16.2238 44.671 16.2238C40.6371 16.2238 37.0347 18.2928 36.1565 22.5798C35.9776 23.5327 35.2782 24.4706 34.3256 24.5152L24.0542 23.4138C23.191 23.2199 22.2384 22.5205 22.4766 21.1955C24.8434 8.75142 36.0818 5 46.1445 5C51.2951 5 58.0233 6.3696 62.0873 10.2697C67.2379 15.0776 66.7465 21.4932 66.7465 28.4746V44.9678C66.7465 49.9248 68.8008 52.0979 70.7358 54.7775C71.4205 55.7301 71.5695 56.8766 70.706 57.5908C68.5476 59.3918 64.707 62.7413 62.5934 64.617L62.5639 64.5872Z" fill="#000008"/>
        </svg>
      )
    },
    {
      name: "Apple",
      logo: (
        <svg className="w-8 h-8 text-slate-200" viewBox="-1.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Dribbble-Light-Preview" transform="translate(-102.000000, -7439.000000)" fill="currentColor">
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485" id="apple-[#173]"/>
              </g>
            </g>
          </g>
        </svg>
      )
    },
    {
      name: "NVIDIA",
      logo: (
        <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c1.46 0 2.76.7 3.57 1.78l-1.46 1.46c-.51-.62-1.27-1.02-2.11-1.02-1.54 0-2.8 1.26-2.8 2.8s1.26 2.8 2.8 2.8c.84 0 1.6-.4 2.11-1.02l1.46 1.46c-.81 1.08-2.11 1.78-3.57 1.78z"/>
        </svg>
      )
    },
    {
      name: "Netflix",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_806_7888)">
            <path d="M64.4988 83.9852C64.6964 84.0644 66.596 84.8348 66.8687 84.946C66.8761 84.9487 66.8922 84.9549 66.9115 84.9629C66.943 84.9753 66.9305 84.97 66.9457 84.9762C66.9785 84.9896 66.9893 84.994 67.001 84.9985C67.0012 84.4016 67.0014 83.5173 67.0015 82.5717C67.0016 81.3618 67.0015 80.0781 67.0015 79.4403V5.00049H51.2891V46.6366C51.7699 47.9959 53.8044 53.7647 54.3252 55.2175C55.2981 57.9886 60.8353 73.6277 61.2779 74.8784C61.6748 76.0011 62.7801 79.1218 63.1314 80.1199C63.3368 80.6982 63.873 82.2105 64.158 83.0165C64.3807 83.6472 64.3606 83.5956 64.4988 83.9852Z" fill="#B11F24"/>
          </g>
          <g filter="url(#filter1_i_806_7888)">
            <path d="M25.5106 6.014C25.3129 5.93439 23.4134 5.16453 23.1407 5.0536C23.1333 5.05057 23.1172 5.04399 23.0979 5.03616C23.0664 5.02371 23.0788 5.02905 23.0637 5.02291C23.0309 5.00974 23.02 5.0052 23.0084 5.00049C23.0082 5.59767 23.0079 6.48193 23.0079 7.42757C23.0078 8.63698 23.0079 9.92111 23.0079 10.5592V84.999C29.2494 84.2491 32.3709 83.9573 38.7203 83.6682V43.3626C38.2395 42.0035 36.205 36.2344 35.6842 34.7816C34.7113 32.0109 29.1741 16.3718 28.7314 15.1207C28.3346 13.9981 27.2293 10.8776 26.878 9.87894C26.6726 9.30124 26.1363 7.78919 25.8514 6.98277C25.6287 6.35223 25.6488 6.404 25.5106 6.014Z" fill="#B11F24"/>
          </g>
          <path d="M38.7124 5H23L50.8228 83.6681C58.6416 83.8655 67.0057 84.9989 67.0057 84.9989L38.7124 5Z" fill="#ED1C24"/>
          <defs>
            <filter id="filter0_i_806_7888" x="51.2891" y="-0.999512" width="15.7109" height="85.998" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="-10"/>
              <feGaussianBlur stdDeviation="3"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" result="hardAlpha"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_806_7888"/>
            </filter>
            <filter id="filter1_i_806_7888" x="23.0078" y="5.00049" width="15.7109" height="85.9985" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="10"/>
              <feGaussianBlur stdDeviation="3"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" result="hardAlpha"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_806_7888"/>
            </filter>
          </defs>
        </svg>
      )
    },
    {
      name: "Uber",
      logo: (
        <svg className="w-8 h-8 text-teal-400" fill="currentColor" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M14.192 14.77c1.377 0 2.494 1.117 2.494 2.494s-1.117 2.494-2.494 2.494-2.494-1.117-2.494-2.494c0-1.377 1.116-2.494 2.494-2.494h0zM22.604 14.755c1.090 0.007 1.995 0.789 2.192 1.823l0.002 0.014h-4.4c0.208-1.047 1.114-1.826 2.204-1.837h0.001zM30.501 13.596c-0.019-0.001-0.042-0.001-0.065-0.001-0.704 0-1.319 0.377-1.656 0.94l-0.005 0.009v-0.891h-1.413v7.215h1.427v-4.105c-0.007-0.056-0.011-0.121-0.011-0.187 0-0.902 0.724-1.635 1.622-1.65l0.001-0h0.594v-1.331h-0.495zM22.634 13.511c-2.053 0.027-3.708 1.698-3.708 3.755 0 2.074 1.681 3.756 3.756 3.756 0.027 0 0.055-0 0.082-0.001l-0.004 0c0.020 0 0.043 0.001 0.067 0.001 1.245 0 2.349-0.602 3.037-1.531l0.007-0.010-1.032-0.764c-0.454 0.644-1.195 1.059-2.032 1.059-0.017 0-0.033-0-0.050-0l0.003 0c-0 0-0 0-0 0-1.205 0-2.204-0.882-2.387-2.036l-0.002-0.014h5.87v-0.466c0.003-0.051 0.004-0.111 0.004-0.171 0-1.976-1.602-3.578-3.578-3.578-0.011 0-0.023 0-0.034 0h0.002zM10.302 10.964v9.903h1.412v-0.906c0.654 0.664 1.562 1.075 2.566 1.075 0.003 0 0.006 0 0.009 0h-0c0.007 0 0.016 0 0.025 0 2.082 0 3.77-1.688 3.77-3.77s-1.688-3.77-3.77-3.77c-0.008 0-0.017 0-0.025 0h0.001c-0.001 0-0.003 0-0.004 0-1.001 0-1.907 0.412-2.555 1.075l-0.001 0.001v-3.606h-1.428zM1.004 10.964v6.196c-0.004 0.062-0.006 0.135-0.006 0.209 0 2.026 1.642 3.667 3.667 3.667 0.031 0 0.061-0 0.092-0.001l-0.005 0c0.015 0 0.032 0 0.049 0 1.007 0 1.917-0.416 2.567-1.087l0.001-0.001v0.92h1.47v-9.903h-1.485v6.108c0.004 0.054 0.007 0.117 0.007 0.181 0 1.35-1.091 2.445-2.439 2.451h-0.001c-0.004 0-0.010 0-0.015 0-1.34 0-2.426-1.086-2.426-2.426 0-0.073 0.003-0.144 0.009-0.215l-0.001 0.009v-6.107h-1.486z"></path>
          </g>
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows in official accent colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D6EFD]/10 bg-blur-glow"></div>

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 select-none">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/logo-horizontal-dark.svg" className="h-18 w-auto select-none" alt="CrackTheLoop Logo" />
        </a>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="/demo" className="text-sm text-slate-400 hover:text-white transition">Interactive Demo</a>
          <a href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing & Key</a>
          <a 
            href="/copilot" 
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0] rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-[#0D6EFD]/25 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            Launch Web Copilot
          </a>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 text-center flex flex-col items-center gap-6 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-sky-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Anti-Share Stealth Affinity Shield Active
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Stealth AI Copilot for <span className="text-gradient">Tech Interviews</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          Capture system audio and microphone inputs in real-time, stream answers through a high-speed AI engine, and render guidance on a transparent, Zoom-invisible desktop overlay or directly in your browser.
        </p>

        <div className="flex gap-4 mt-4">
          <a
            href="/copilot"
            className="px-8 py-3.5 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-bold shadow-lg shadow-[#0D6EFD]/20 transition active:scale-98 flex items-center gap-2"
          >
            Launch Browser Copilot
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/pricing"
            className="px-8 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl font-bold hover:bg-slate-800 transition active:scale-98"
          >
            Get Subscription Key
          </a>
        </div>
      </section>

      {/* Target Companies Section (Showcase List) */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="companies-showcase">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black tracking-tight text-white flex justify-center items-center gap-2" id="company-showcase-heading">
            <Trophy className="w-5.5 h-5.5 text-amber-400 animate-pulse" />
            Land Offers at World-Class Tech Giants
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">Our users have successfully bypassed the technical bar at leading global corporations</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {companies.map((c, i) => (
            <div key={i} className="glow-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3 bg-[#0c1125] border-white/5 text-center min-h-[110px] select-none hover:border-sky-500/25">
              <div className="p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {c.logo}
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Success Stats Grid */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="success-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex justify-center items-center text-sky-400 shrink-0 border border-sky-500/15 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">94.2%</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Offer Land Rate</p>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex justify-center items-center text-indigo-400 shrink-0 border border-indigo-500/15 shadow-sm">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">4,800+</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Interviews Cleared</p>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex justify-center items-center text-emerald-400 shrink-0 border border-emerald-500/15 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">&lt; 0.9s</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Average Response Time</p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Simulator Teaser Card */}
      <section id="demo-teaser" className="w-full max-w-4xl mx-auto px-6 pt-24 relative z-20">
        <div className="glow-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-white/10 bg-[#0c1125]">
          <div className="flex flex-col gap-4 max-w-md">
            <div className="inline-flex w-fit items-center gap-1.5 bg-[#0DCAF0]/15 border border-[#0DCAF0]/25 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
              Live Pipeline Simulation
            </div>
            <h2 className="text-2xl font-black text-white">Test the Real-Time Streaming Pipeline</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Explore how audio is mixed, processed, and transcribed instantly to return live answers in under 1 second. Inspect the detailed log output step-by-step.
            </p>
            <a 
              href="/demo" 
              className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition"
            >
              Try Simulator Demo <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
            </a>
          </div>
          
          <div className="bg-[#050711] border border-white/5 p-5 rounded-2xl w-full md:w-[320px] flex flex-col gap-3 shrink-0 shadow-inner font-mono text-[10px]">
            <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Simulator Preview</span>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-slate-300">Downsampling stream...</span>
            </div>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-emerald-400">Deepgram VAD active (300ms)</span>
            </div>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-cyan-400">Streaming SSE tokens...</span>
            </div>
            <div className="border border-dashed border-emerald-500/20 p-2 rounded text-emerald-400/90 text-[9px] bg-emerald-500/5 mt-1 font-bold">
              "• Reconciliation works via B-Tree diffs..."
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Teaser */}
      <section id="features-teaser" className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20">
        <div className="text-center mb-12 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight">Engineered for Stealth and Speed</h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">Discover the key components of our loopback capture architecture</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex justify-center items-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Sub-Second Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Real-time audio processing and silence detection work together to return solutions inside the transparent overlay in under a second.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex justify-center items-center text-indigo-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Screen Share Evasion</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Our native client uses Win32 display affinity to bypass screensharing tools (Zoom, Meet, Slack), keeping the overlay completely invisible.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center text-emerald-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual-Channel Mixing</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Mixes and processes microphone audio and loopback speaker output simultaneously to capture the full conversation on the fly.
            </p>
          </div>

        </div>

        <div className="text-center mt-10">
          <a 
            href="/features" 
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95 text-slate-200"
          >
            Read Technical Deep Dives <ArrowRight className="w-4 h-4 text-sky-400" />
          </a>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="w-full max-w-5xl mx-auto px-6 pt-28 relative z-20">
        <div className="text-center mb-16 select-none">
          <div className="inline-flex items-center gap-2 bg-[#0DCAF0]/10 border border-[#0DCAF0]/25 px-4 py-1.5 rounded-full text-xs font-bold text-cyan-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Step-by-Step Workflow
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">How CrackTheLoop Works</h2>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto">Five automated stages — from audio capture to invisible answer rendering — in under a second.</p>
        </div>

        <div className="flex flex-col gap-0">
          {[
            {
              step: "01",
              icon: <MonitorSpeaker className="w-5 h-5" />,
              color: "sky",
              title: "Your Interview Begins",
              desc: "Join any video call as usual — Zoom, Google Meet, Microsoft Teams, or any other platform. CrackTheLoop silently starts listening in the background the moment you enable it. No setup, no configuration mid-call.",
            },
            {
              step: "02",
              icon: <Cpu className="w-5 h-5" />,
              color: "indigo",
              title: "Audio is Captured in Real Time",
              desc: "Both the interviewer's voice and your own microphone are picked up simultaneously, with no virtual cables or extra hardware. The audio is processed instantly on your device — nothing is stored or sent without your action.",
            },
            {
              step: "03",
              icon: <BrainCircuit className="w-5 h-5" />,
              color: "purple",
              title: "Questions are Detected Instantly",
              desc: "The moment the interviewer finishes speaking, CrackTheLoop recognizes the question automatically. There's no button to press — it detects pauses and surfaces the relevant question text without any manual input from you.",
            },
            {
              step: "04",
              icon: <Zap className="w-5 h-5" />,
              color: "amber",
              title: "AI Crafts a Precise Answer",
              desc: "A cutting-edge AI model processes the question and generates a structured, interview-ready answer — covering the key points an interviewer expects. Responses stream in token-by-token so you see them building in real time.",
            },
            {
              step: "05",
              icon: <EyeOff className="w-5 h-5" />,
              color: "emerald",
              title: "Answer Appears — Only for Your Eyes",
              desc: "The answer shows up on a floating overlay on your screen that is completely invisible to screen recording tools, Zoom, Meet, and Teams. Your interviewer sees only you — calm, confident, and in control.",
            },
          ].map(({ step, icon, color, title, desc }, i) => {
            const colors = {
              sky: {
                bg: "bg-sky-500/10",
                border: "border-sky-500/25",
                text: "text-sky-400",
                shadow: "group-hover:shadow-sky-500/20",
              },
              indigo: {
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/25",
                text: "text-indigo-400",
                shadow: "group-hover:shadow-indigo-500/20",
              },
              purple: {
                bg: "bg-purple-500/10",
                border: "border-purple-500/25",
                text: "text-purple-400",
                shadow: "group-hover:shadow-purple-500/20",
              },
              amber: {
                bg: "bg-amber-500/10",
                border: "border-amber-500/25",
                text: "text-amber-400",
                shadow: "group-hover:shadow-amber-500/20",
              },
              emerald: {
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/25",
                text: "text-emerald-400",
                shadow: "group-hover:shadow-emerald-500/20",
              },
            }[color as "sky" | "indigo" | "purple" | "amber" | "emerald"] || {
              bg: "bg-sky-500/10",
              border: "border-sky-500/25",
              text: "text-sky-400",
              shadow: "group-hover:shadow-sky-500/20",
            };

            return (
              <div key={i} className="flex gap-6 pb-10 group">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 ${colors.bg} border ${colors.border} ${colors.text} shadow-lg ${colors.shadow} transition-all duration-300`}>
                    {icon}
                    <span className="text-[9px] font-black tracking-widest text-white/30">{step}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pt-2 max-w-2xl">
                  <h3 className="text-base font-bold text-white group-hover:text-sky-200 transition-colors">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section id="comparison" className="w-full max-w-5xl mx-auto px-6 pt-28 relative z-20">
        <div className="text-center mb-12 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Why CrackTheLoop?</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Stack it against the alternatives — no contest.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#0c1125] border-b border-white/10">
                <th className="px-6 py-4 text-slate-400 font-extrabold uppercase tracking-wider text-xs w-[40%]">Feature</th>
                <th className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-gradient-to-r from-[#6610F2] to-[#0DCAF0] bg-clip-text text-transparent uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5 text-purple-400" /> Stealth Overlay
                  </span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-[11px] font-black text-sky-400 uppercase tracking-widest">Browser Copilot</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Traditional Chat</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Invisible to Screen Share",          true,  false, false],
                ["Picks Up Audio Automatically",        true,  true,  false],
                ["Sub-Second Answer Speed",             true,  true,  false],
                ["No Manual Copy-Paste",               true,  true,  false],
                ["No Browser Extension Needed",        true,  false, true],
                ["Answers Stream Word-by-Word",         true,  true,  false],
                ["Captures Both Sides of the Call",    true,  true,  false],
                ["Works on Windows",                   true,  true,  true],
                ["Works on macOS",                     true,  true,  true],
                ["Works on Linux",                     false, true,  true],
              ].map(([label, col1, col2, col3], i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-[#0b0e1b]" : "bg-[#0d1020]"} hover:bg-[#111933] transition-colors`}>
                  <td className="px-6 py-3.5 text-slate-300 font-medium text-xs">{label as string}</td>
                  <td className="px-6 py-3.5 text-center">{col1 ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="px-6 py-3.5 text-center">{col2 ? <Check className="w-4 h-4 text-sky-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="px-6 py-3.5 text-center">{col3 ? <Check className="w-4 h-4 text-slate-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Developer FAQ ── */}
      <FaqSection />

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 pt-24 text-center text-xs text-slate-500 relative z-20 border-t border-white/5 mt-16 flex justify-between items-center select-none">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-500/80 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Win32 Stealth Affinity Shield Enabled
        </span>
      </footer>

    </main>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can interviewers detect CrackTheLoop?",
      a: "No. The desktop overlay uses advanced system-level display features to ensure the window is completely invisible to screen-sharing and recording tools, including Zoom, Google Meet, Microsoft Teams, and Discord. The audio processing is handled privately on your device.",
    },
    {
      q: "Do I need to install virtual audio cables or custom drivers?",
      a: "No. CrackTheLoop captures your microphone and speaker audio directly without requiring any complex virtual cable installations, audio routing drivers, or administrator privileges. It works right out of the box.",
    },
    {
      q: "How fast are the answers generated?",
      a: "Answers appear in less than a second. The system captures the conversation, transcribes the questions, and generates structured, context-aware responses in real time as the conversation progresses.",
    },
    {
      q: "Is my private data secure?",
      a: "Absolutely. Your audio data and keys are processed locally on your machine and are never stored, logged, or shared with third parties. Your privacy is our highest priority.",
    },
    {
      q: "Which operating systems are supported?",
      a: "The browser-based dashboard works on all platforms (Windows, macOS, and Linux). The fully invisible native desktop overlay supports both Windows and macOS natively.",
    },
    {
      q: "Can I use my own API credentials?",
      a: "Yes. CrackTheLoop allows you to configure your own API credentials directly in your browser's local storage to route and stream answers through your preferred provider.",
    },
    {
      q: "Is there a free trial or demo?",
      a: "Yes, you can try our interactive simulator on the Demo page to see the real-time response pipeline in action before upgrading to a premium pass.",
    },
  ];

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-6 pt-28 pb-8 relative z-20">
      <div className="text-center mb-12 select-none">
        <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/25 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 mb-5">
          <Shield className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Common Questions</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Everything you need to know about safety, setup, and features.</p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="glow-card rounded-2xl border border-white/5 bg-[#0c1125] overflow-hidden transition-all duration-300"
          >
            <button
              id={`faq-q-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 group cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 text-sky-400" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
