import type {
  IBetArgs,
  IBetInfoBack,
  IResponseList,
  ISportEventInfo,
  ISportEventList,
  ISportOutrightsInfo,
  ISportsBetListArgs,
  ISportsMyBetSlipItem,
} from './types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import type { IBetInfo } from '~/types'

/**
 * 获取所有体育计数
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b9bcba6d-49cf-4de9-a304-cf80caf8f46c
 */
export function ApiSportCount(data: {
  /** 是否取得串关数量
   *
   * 0:全部
   *
   * 1:支援串关
   *
   * 2:不支援串关 */
  ic: number
}) {
  return httpClient.post<{
    /** count 总数 */
    c: number
    /** 即将开赛总数 */
    nc: number
    list: {
    /** 球种Id */
      si: number
      /** 球种名称 */
      sn: string
      /** earlyCount 早盘数量 */
      ec: number
      /** todayCount 今日数量 */
      tc: number
      /** liveCount 滚球数量 */
      lc: number
      /** 即将开赛数量 */
      nc: number
      /** outrightCount 冠军赛数量 */
      oc: number
      /** count 总数 */
      c: number
      /** 球种图片 */
      spic: string
    }[]
  }>(`/sport/${getSportsPlatId()}/count`, data)
}

/**
 * 侧边栏列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c4f949f2-ecca-470e-b7f1-f980bd7fb70c
 */
export function ApiSportSidebar() {
  return httpClient.post<{
    menu: {
      menu_id: number
      name: string
      list: {
        si: number
        sn: string
        spic: string
        list: {
          ci: string
          cn: string
          cpic: string
          pgid: string
        }[]
      }[]
    }[]
    all: {
      si: number
      sn: string
      spic: string
    }[]
  }>(`/sport/${getSportsPlatId()}/sidebar`)
}

/**
 * 联赛列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=bb7c74b6-711c-4a6a-88bd-2e131eb95a95
 */
export function ApiSportCompetitionList(data: {
  /** 球种Id */
  si: number
  /** 种类
   *
   * normal:一般赛事
   *
   * outright:冠军赛 */
  kind: string
}) {
  return httpClient.post<{
    /** 热门联赛列表 */
    hot: {
      /** 地区Id */
      pgid: string
      /** 地区名称 */
      pgn: string
      /** count 总数 */
      c: number
      /** 联赛列表 */
      cl: {
        /** 联赛id */
        ci: string
        /** 联赛名称 */
        cn: string
        /** count 总数 */
        c: number
      }[]
    }[]
    /** 联赛列表 */
    list: {
      /** 地区Id */
      pgid: string
      /** 地区名称 */
      pgn: string
      /** count 总数 */
      c: number
      cl: {
        /** 联赛id */
        ci: string
        /** 联赛名称 */
        cn: string
        /** count 总数 */
        c: number
      }[]
    }[]
  }>(`/sport/${getSportsPlatId()}/competition/list`, data)
}

/**
 * 获取赛事列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=51d0dcf6-cfde-4672-884c-81ff05e0c07e
 */
export function ApiSportEventList(data: {
  /** 球种Id */
  si: number
  /** market
   * 0:取所有
   *
   * 1:早盘
   *
   * 2:今日
   *
   * 3:滚球
   *
   * 4:即将开赛
   *
   * 5:即将开赛及滚球 */
  m: number
  page: number
  page_size: number
  /** 是否热门 */
  hot?: number
  /** 联赛id */
  ci?: string[]
  /** 地区id */
  pgid?: string
}) {
  return httpClient.post<{
    /** 资料更新时间 */
    delta: number
    /** 联赛列表 */
    d: ISportEventInfo[]
    t: number
  }>(`/sport/${getSportsPlatId()}/event/list`, data)
}

/**
 * 获取赛事列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4a7e9957-f7fe-4404-97ef-92840479a803
 */
export function ApiSportEventDelta(data: {
  /** 球种Id */
  si: number
  /** market 1:早盤 */
  m: string
  /** 1198399587 最后更新时间 */
  delta: number
}) {
  return httpClient.post<{
    /** 资料更新时间 */
    delta: number
    list: ISportEventList[]
  }>(`/sport/${getSportsPlatId()}/event/delta`, data)
}

/**
 * 单场赛事详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6238fa9d-1a7e-4daf-a57c-0cc97163fdbb
 */
export function ApiSportEventInfo(data: {
  /** 球种Id */
  si: number
  /** 赛事ID */
  ei: string
}) {
  return httpClient.post<{
    /** 资料更新时间 */
    delta: number
    list: ISportEventInfo[]
    /**
     * 1:成功
     *
     * 3:赛事已结束
     */
    status: 1 | 3
  }>(`/sport/${getSportsPlatId()}/event/info`, data)
}

/**
 * 首页大类
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ae1fee09-d03e-4f27-a7bb-6a2bbdc4d74f
 */
export function ApiSportMenuMain() {
  return httpClient.post<{
    list: {
      menu_id: number
      menu_name: string
    }[]
  }>(`/sport/${getSportsPlatId()}/menu/main`)
}

/**
 * 冠军列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=30bb4469-a21f-4267-b30c-b6e8555a6b89
 */
export function ApiSportOutrightList(data: {
  /** 球种id */
  si: number
  page: number
  page_size: number
}) {
  return httpClient.post<IResponseList<ISportOutrightsInfo>>(`/sport/${getSportsPlatId()}/outright/list`, data)
}

/**
 * 获取收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=bf0538b1-2dae-474d-ad17-1670d56fb8f5
 */
export function ApiSportGetFavoriteList(data: {
  sis: Array<number>
  cur: string
}) {
  return httpClient.post<{
    /** 资料更新时间 */
    delta: number
    d: ISportEventInfo[]
    t: number
  }>(`/sport/${getSportsPlatId()}/favorite/get`, data)
}

/**
 * 加入收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=df4beeeb-d4c2-451b-af7f-11ba328e54d3
 * /favorite/add
 */
export function ApiSportAddFavorite(data: {
  si: number
  eis: string[]
  cur: string
}) {
  return httpClient.post(`/sport/${getSportsPlatId()}/favorite/add`, data)
}

/**
 * 删除收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=fb17c977-b030-46c3-822a-419330f5b893
 * /favorite/add
 */
export function ApiSportDelFavorite(data: {
  si: number
  eis: string[]
  cur: string
}) {
  return httpClient.post(`/sport/${getSportsPlatId()}/favorite/del`, data)
}

/**
 * 赛事搜索
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=540a58d7-8a27-4123-9074-7a5d7272e09d
 */
export function ApiSportEventSearch(data: { word: string }) {
  return httpClient.post<{
    list: {
      si: number
      sn: string
      c: number
      list: {
        pgid: string
        pgn: string
        ci: string
        cn: string
        ei: string
        ed: number
        htn: string
        atn: string
      }[]
    }[]
  }>(`/sport/${getSportsPlatId()}/event/search`, data)
}

/**
 * 索取投注信息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=f83af7ce-84be-4ef9-a20e-d76d31e5b418
 */
export function ApiSportPlaceBetInfo(data: {
  /** 0:非串关 1:串关 */
  ic: 0 | 1
  /** 投注内容 */
  bi: IBetInfo[]
  /** 货币 */
  cur: CurrencyCode
}) {
  return httpClient.post<IBetInfoBack>(`/sport/${getSportsPlatId()}/place/betinfo`, data)
}

/**
 * 体育投注
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3285b34f-36a0-4b50-898e-a71ace74f229
 */
export function ApiSportPlaceBet(data: IBetArgs) {
  return httpClient.post<string>(`/sport/${getSportsPlatId()}/place/bet`, data)
}

/*
 * 投注记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ed6c7a9f-30aa-4cf6-89d7-130fa962a136
 */
export function ApiSportBetList(data: ISportsBetListArgs) {
  return httpClient.post<IResponseList<ISportsMyBetSlipItem>>(
    `/sport/${getSportsPlatId()}/betlist`,
    data,
    {
      timeout: 30 * 1000,
    },
  )
}

/**
 * 热门赛事
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b4f7b09e-0d3e-420b-8069-a47531f8885f
 */
export function ApiSportsEventHot(data: {
  si: number
  page: 1
  page_size: 10
}) {
  return httpClient.post <IResponseList<{
    ci: string
    cn: string
    ei: string
    htn: string
    atn: string
    atpic: string
    htpic: string
    cpic: string
    pgid: string
    ed: number
  }>>(`/sport/${getSportsPlatId()}/event/hot`, data)
}
