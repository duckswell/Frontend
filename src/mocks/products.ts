// [아카이빙용 목 데이터] 백엔드 product·ingredient 테이블 대체
// 출처: Crawler 레포 products_final.json 기반 seed SQL (파파레서피/원오세븐/더마포티투/피쓰)
//       + 비타민C·징크·알로에 수동 보강 제품

import type {
  ProductCategory,
  RecommendedIngredient,
  RecommendedProduct,
} from "../api/product";
import type { RecommendedRoutineProduct } from "../api/routine";

export const MOCK_INGREDIENTS: RecommendedIngredient[] = [
  { id: 1, name: "판테놀", category: "MOISTURE" },
  { id: 2, name: "센텔라", category: "PLANT_EXTRACT" },
  { id: 3, name: "세라마이드", category: "MOISTURE" },
  { id: 4, name: "히알루론산", category: "MOISTURE" },
  { id: 5, name: "알로에", category: "PLANT_EXTRACT" },
  { id: 6, name: "나이아신아마이드", category: "VITAMIN" },
  { id: 7, name: "비타민C", category: "VITAMIN" },
  { id: 8, name: "징크", category: "VITAMIN" },
];

type IngredientName =
  | "판테놀"
  | "센텔라"
  | "세라마이드"
  | "히알루론산"
  | "알로에"
  | "나이아신아마이드"
  | "비타민C"
  | "징크";

interface MockProduct extends Omit<RecommendedProduct, "id"> {
  ingredients: IngredientName[];
}

const paparecipe = (
  name: string,
  category: ProductCategory,
  image: string,
  path: string,
  ingredients: IngredientName[]
): MockProduct => ({
  name,
  brand: "파파레서피",
  category,
  imageUrl: `https://paparecipe.com/web/product/medium/${image}`,
  linkUrl: `https://paparecipe.com/product/${path}/category/282/display/1/`,
  ingredients,
});

const oneOSeven = (
  name: string,
  category: ProductCategory,
  image: string,
  productNo: number,
  ingredients: IngredientName[]
): MockProduct => ({
  name,
  brand: "원오세븐",
  category,
  imageUrl: `https://107beauty.co.kr/web/product/medium/${image}`,
  linkUrl: `https://107beauty.co.kr/product/detail.html?product_no=${productNo}&cate_no=24&display_group=1`,
  ingredients,
});

const pith = (
  name: string,
  category: ProductCategory,
  image: string,
  productNo: number,
  ingredients: IngredientName[]
): MockProduct => ({
  name,
  brand: "피쓰",
  category,
  imageUrl: `https://ecimg.cafe24img.com/pg1544b10317963036/amredcosmetic/web/product/big/${image}`,
  linkUrl: `https://pithseoul.com/product/detail.html?product_no=${productNo}&cate_no=42&display_group=1`,
  ingredients,
});

const manual = (
  ingredient: IngredientName,
  brand: string,
  name: string,
  category: ProductCategory,
  linkUrl: string,
  imageUrl: string | null = null
): MockProduct => ({
  name,
  brand,
  category,
  imageUrl,
  linkUrl,
  ingredients: [ingredient],
});

const PRODUCT_DATA: MockProduct[] = [
  // 파파레서피
  paparecipe("가지 클리어링 포어 타이트닝 모이스처 크림 100ml", "CREAM", "202603/c473d84f8854286709f5a9cd2e5bab0e.jpg", "가지-클리어링-포어-타이트닝-모이스처-크림-100ml/1893", ["세라마이드", "나이아신아마이드"]),
  paparecipe("가지 클리어링 포어 핏 세럼 30ml", "AMPOULE_SERUM", "202601/7f8489fa8a319a89e33ac7fce8715fdb.jpg", "가지-클리어링-포어-핏-세럼-30ml/1882", ["히알루론산", "센텔라", "나이아신아마이드"]),
  paparecipe("가지 클리어링 포어 리파인 토너 150ml", "SKIN_TONER", "202601/c26136f0fa7a4a4a4937eb88a56b4dd3.jpg", "가지-클리어링-포어-리파인-토너-150ml/1881", ["세라마이드", "나이아신아마이드"]),
  paparecipe("히알루론산PDRN 딥 모이스트 베리어 듀얼 페이즈 미스트 100ml", "MIST_OIL", "202601/92510743fa83b050d420a474de785cd7.jpg", "히알루론산pdrn-딥-모이스트-베리어-듀얼-페이즈-미스트-100ml/1880", ["히알루론산", "센텔라", "나이아신아마이드"]),
  paparecipe("콜라겐 PDRN 레디언스 퍼밍 듀얼 페이즈 미스트 100ml", "MIST_OIL", "202601/259fc71d922406272d57cac37382093d.jpg", "콜라겐-pdrn-레디언스-퍼밍-듀얼-페이즈-미스트-100ml/1879", ["판테놀", "알로에", "세라마이드", "센텔라", "나이아신아마이드"]),
  paparecipe("레티놀 바쿠치올 PDRN 리파인 글로우 듀얼 페이즈 미스트 100ml", "MIST_OIL", "202601/16083cc327e8cf45f13880b229a4be5f.jpg", "레티놀-바쿠치올-pdrn-리파인-글로우-듀얼-페이즈-미스트-100ml/1878", ["히알루론산", "세라마이드", "센텔라", "나이아신아마이드"]),
  paparecipe("나이아신아마이드 PDRN 브라이트닝 톤 업 듀얼 페이즈 미스트 100ml", "MIST_OIL", "202601/16e9304be0ac13f1f22411b33b467aa0.jpg", "나이아신아마이드-pdrn-브라이트닝-톤-업-듀얼-페이즈-미스트-100ml/1877", ["히알루론산", "판테놀", "세라마이드", "센텔라", "나이아신아마이드"]),
  paparecipe("라이스 블레미쉬 딥 모이스트 선크림 50ml", "CREAM", "202601/9c4d105931265db00aafae1c7a17a615.jpg", "라이스-블레미쉬-딥-모이스트-선크림-50ml/1872", ["히알루론산", "나이아신아마이드"]),
  paparecipe("블레미쉬 딥 브라이트닝 크림 마스크 (10매)", "CREAM", "202602/efb190bbd565eea3bba76bccd2ed23a4.jpg", "블레미쉬-딥-브라이트닝-크림-마스크-10매/1716", ["히알루론산", "판테놀", "세라마이드", "나이아신아마이드"]),
  paparecipe("리얼 센텔라 시카 크림 리페어 마스크 (1매)", "CREAM", "202503/efbbafc08888f0f4c064df755cd57ee0.jpg", "리얼-센텔라-시카-크림-리페어-마스크-1매/1711", ["판테놀", "센텔라"]),
  paparecipe("리얼 센텔라 시카 워터리 클렌징 티슈 100매", "CLEANSER", "202504/2baec532545204ba396c1d071970853a.jpg", "리얼-센텔라-시카-워터리-클렌징-티슈-100매/1685", ["히알루론산", "센텔라"]),
  paparecipe("리얼 센텔라 시카 크림 리페어 마스크 (10매)", "CREAM", "202504/facaddd30c31c7bcfa4d75643e7f8184.jpg", "리얼-센텔라-시카-크림-리페어-마스크-10매/1684", ["판테놀", "센텔라"]),
  paparecipe("리얼 센텔라 시카 쿨링 워터 핏 토너패드 80매", "SKIN_TONER", "202504/9878cd07916b99e833256f80efe8740f.jpg", "리얼-센텔라-시카-쿨링-워터-핏-토너패드-80매/1682", ["판테놀", "센텔라"]),
  paparecipe("리얼 센텔라 시카 인텐시브 크림 100ml", "CREAM", "202608/fcfca2e5834b8a6055dc195c911d481e.jpg", "리얼-센텔라-시카-인텐시브-크림-100ml/1681", ["히알루론산", "판테놀", "세라마이드", "센텔라"]),
  paparecipe("리얼 센텔라 시카 인텐시브 크림 50ml", "CREAM", "202608/011627d3746b2fc48365ea0550138f43.jpg", "리얼-센텔라-시카-인텐시브-크림-50ml/1680", ["히알루론산", "판테놀", "세라마이드", "센텔라"]),
  paparecipe("리얼 센텔라 시카 카밍 세럼 30ml", "AMPOULE_SERUM", "202504/267b29fa0e77e360a239cca8a17f786c.jpg", "리얼-센텔라-시카-카밍-세럼-30ml/1679", ["히알루론산", "판테놀", "센텔라"]),
  paparecipe("리얼 센텔라 시카 수딩 토너 150ml", "SKIN_TONER", "202504/addc25bf338179b05c42fa9de4738672.jpg", "리얼-센텔라-시카-수딩-토너-150ml/1678", ["히알루론산", "판테놀", "센텔라"]),
  paparecipe("가지 클리어링 앰플 30ml", "AMPOULE_SERUM", "202404/c85c855a8bae0de97dbadf2220a0dcad.jpg", "가지-클리어링-앰플-30ml/1506", ["센텔라"]),
  paparecipe("블레미쉬 세럼 30ml", "AMPOULE_SERUM", "202404/be8fe13a85a6e466eeb71080f6f14581.jpg", "블레미쉬-세럼-30ml/1502", ["히알루론산", "판테놀", "나이아신아마이드"]),
  paparecipe("미니 마블 SET (마데케어 연고+블레미쉬 크림 50ml)", "CREAM", "202311/c69d8f0d606cbf0f4cd8053b68f660fd.jpg", "미니-마블-set-마데케어-연고블레미쉬-크림-50ml/1406", ["센텔라"]),
  paparecipe("블레미쉬 크림 (50ml / 100ml) 택1", "CREAM", "202606/fb57e9d2e40b5bc82c90e4fc73e5799d.jpg", "블레미쉬-크림-50ml-100ml-택1/1405", ["판테놀", "세라마이드", "나이아신아마이드"]),
  paparecipe("가지 클리어링 효소 파우더 클렌저 50g", "CLEANSER", "202604/cb516621540e802d0971f3da708d7e22.jpg", "가지-클리어링-효소-파우더-클렌저-50g/1357", ["히알루론산"]),
  paparecipe("마일드 더마 모이스처 크림 패드 1BOX(5매입)", "CREAM", "202608/458b86e454e380d712136f2936a97152.jpg", "마일드-더마-모이스처-크림-패드-1box5매입/1338", ["판테놀", "세라마이드"]),
  paparecipe("마일드 더마 엑토인 1% 크림 150ml", "CREAM", "202608/8ef9dc05e70103b853b440f1ae1a9793.jpg", "마일드-더마-엑토인-1-크림-150ml/1337", ["세라마이드"]),
  paparecipe("가지 클리어링 필링 패드 토너 70매", "SKIN_TONER", "202602/6dc94009382af9078f29a3a3b3ecf033.jpg", "가지-클리어링-필링-패드-토너-70매/1276", ["히알루론산", "센텔라"]),
  paparecipe("티트리 컨트롤 클렌징 폼 120ml", "CLEANSER", "202608/63a49f803ea791ba7faf7219f7b67060.jpg", "티트리-컨트롤-클렌징-폼-120ml/1213", ["센텔라"]),
  paparecipe("노블 랏 리프팅 크림 100ml", "CREAM", "202608/79d1555db44c2c0e63f63695ed5f6a26.jpg", "노블-랏-리프팅-크림-100ml/1212", ["세라마이드"]),
  paparecipe("티트리 컨트롤 수딩 크림 100ml", "CREAM", "202206/6fcf4b21519039f0a58454bdd98433e0.jpg", "티트리-컨트롤-수딩-크림-100ml/1209", ["센텔라"]),
  paparecipe("티트리 컨트롤 시카 앰플 30ml", "AMPOULE_SERUM", "202608/6e86fe07faa721c7e40befa196e70b56.jpg", "티트리-컨트롤-시카-앰플-30ml/1194", ["히알루론산", "센텔라"]),
  paparecipe("가지 클리어링 선 크림 50ml", "CREAM", "202206/ac49bdf1f42fbd1b69854f1a0f21331b.jpg", "가지-클리어링-선-크림-50ml/1171", ["센텔라", "나이아신아마이드"]),
  paparecipe("가지 클리어링 루페올 크림 100ml", "CREAM", "202202/9103bf55bab98b0883b7ab6af75ca0a4.jpg", "가지-클리어링-루페올-크림-100ml/1147", ["히알루론산", "센텔라", "나이아신아마이드"]),
  paparecipe("노블 랏 리프팅 앰플 30ml", "AMPOULE_SERUM", "202608/b3378a9f4ffdf826ad2bcebb1111b268.jpg", "노블-랏-리프팅-앰플-30ml/1117", ["히알루론산"]),
  paparecipe("블레미쉬 세럼 150ml", "AMPOULE_SERUM", "202112/3502f3f0c9fc478f1346b6cfe32eb5bd.jpg", "블레미쉬-세럼-150ml/1069", ["히알루론산", "판테놀", "나이아신아마이드"]),
  paparecipe("마블 SET (마데케어 연고+블레미쉬 크림 100ml)", "CREAM", "202606/afdf855ccd66fbb58fee751026a48aa0.jpg", "마블-set-마데케어-연고블레미쉬-크림-100ml/1024", ["센텔라"]),
  paparecipe("가지 클리어링 필링 패드 토너 리필 35매", "SKIN_TONER", "202211/329f3ba669c8a800ab28586bf631f9d8.jpg", "가지-클리어링-필링-패드-토너-리필-35매/962", ["히알루론산", "센텔라"]),
  paparecipe("티트리 컨트롤 스킨 200ml", "SKIN_TONER", "202308/79e199cb19a0905de55755f9279a1de2.jpg", "티트리-컨트롤-스킨-200ml/32", ["히알루론산", "센텔라"]),

  // 원오세븐
  oneOSeven("마이크로 드리즐 하이드로 토너", "SKIN_TONER", "202604/c0488d68d0798992fece66d917a042a7.png", 98, ["히알루론산", "판테놀"]),
  oneOSeven("에브리데이 플럼프 하이드로 크림", "CREAM", "202604/4f649a1689cbe482f61720c9609b0b67.png", 101, ["히알루론산", "판테놀", "세라마이드", "센텔라"]),
  oneOSeven("더블 레이어 밀키세럼", "AMPOULE_SERUM", "202604/2f5da08fa29ae06b63cb11a0d0310ddc.png", 187, ["히알루론산", "나이아신아마이드"]),
  oneOSeven("소서 빈바이옴 비타민C 세럼", "AMPOULE_SERUM", "202502/de317d6548f0b5a59c2120dc311a6e9f.png", 139, ["히알루론산", "판테놀", "센텔라", "나이아신아마이드", "비타민C"]),
  oneOSeven("컴플리트 홈 케어 세럼 세트", "AMPOULE_SERUM", "202506/64f94b72f4b2bb3a1179616d17431a10.png", 134, ["히알루론산", "판테놀", "세라마이드", "센텔라", "나이아신아마이드", "비타민C"]),

  // 더마포티투
  {
    name: "테라마이드 베리어 밸런싱 크림 30ml",
    brand: "더마포티투",
    category: "CREAM",
    imageUrl: "https://derma42.com/web/product/medium/202606/e786cbdaa17e68ce9c8808056c34cc5b.jpg",
    linkUrl: "https://derma42.com/product/테라마이드-베리어-밸런싱-크림-30ml/9/category/64/display/1/",
    ingredients: ["히알루론산", "판테놀", "세라마이드", "센텔라"],
  },
  {
    name: "테라마이드 수딩 릴리프 세럼 30ml",
    brand: "더마포티투",
    category: "AMPOULE_SERUM",
    imageUrl: "https://derma42.com/web/product/medium/202606/44c962b61de17863aa104da907d06548.jpg",
    linkUrl: "https://derma42.com/product/테라마이드-수딩-릴리프-세럼-30ml/10/category/64/display/1/",
    ingredients: ["히알루론산", "세라마이드", "센텔라"],
  },

  // 피쓰
  pith("피쓰 클래리파이 겔 토너 340g", "SKIN_TONER", "20260714/48f532cbf7a6dbfe95b57493c52ae4d6.png", 49, ["히알루론산", "나이아신아마이드"]),
  pith("피쓰 블루 리페어 하이드로 수딩 크림 120ml", "CREAM", "20260325/82aa43585598839f8429591e6dee460f.png", 42, ["나이아신아마이드", "세라마이드", "히알루론산", "판테놀"]),
  pith("[키링 증정] 피쓰 판테티놀 선 에센스 10ml", "AMPOULE_SERUM", "20260306/ff224162c2163f23fa0c241e5e21579b.png", 38, ["나이아신아마이드", "판테놀"]),
  pith("[론칭 특가 30% OFF] 피쓰 판테티놀 선 에센스 30ml", "AMPOULE_SERUM", "20260306/0ba1237fc98f33829649e8ca7fcbc787.png", 37, ["나이아신아마이드", "판테놀"]),
  pith("피쓰 코어 리빌드 크림 50ml", "CREAM", "20251107/7fcc1cc815ab5ada53419b5b4775e7f6.png", 12, ["세라마이드"]),
  pith("피쓰 코어 리빌드 크림 15ml", "CREAM", "20251107/12d06e112cf8ee69429310a4062d1999.png", 11, ["세라마이드"]),

  // 비타민C 수동 보강
  manual("비타민C", "Dr. Shy", "닥터샤이 다크스팟 크림", "CREAM", "https://drshy.kr/product/11-닥터샤이-다크스팟-크림/10/category/102/display/1/", "https://drshy.kr/web/product/big/202606/078f6d73dff4113626ef2919b47ba317.png"),
  manual("비타민C", "Dr.Melaxin", "멜라씨이 페룰릭 크림", "CREAM", "https://melaxin.com/product/detail.html?product_no=2494&cate_no=42&display_group=1", "https://cafe24img.poxo.com/barber501f/web/product/big/202607/4ae6fa577600c41cf960a8d5ed18079e.png"),
  manual("비타민C", "neaf neaf", "비타 PDRN 앰플", "AMPOULE_SERUM", "https://neafneaf.com/products/vita-pdrn-ampoule", "http://neafneaf.com/cdn/shop/files/1._69326a6c-4d33-4f3f-b3ca-a57ea4dace55.jpg?v=1753756507&width=2048"),
  manual("비타민C", "CLEEVA", "클리바 르 클레어 앰플 30ml", "AMPOULE_SERUM", "https://cleeva.co.kr/product/클리바-르-클레어-앰플-30ml/11/category/25/display/1/", "https://cleeva.co.kr/web/product/big/202510/dac2046150a87de79a4f77386f75523b.jpg"),
  manual("비타민C", "구달", "청귤 비타C 잡티케어 세럼 알파", "AMPOULE_SERUM", "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000229789", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0022/A00000022978923ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("비타민C", "구달", "구달 청귤 비타C 잡티케어 패드 알파 70매", "SKIN_TONER", "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000229788", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0022/A00000022978808ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("비타민C", "이니스프리", "비타민C 캡슐 세럼", "AMPOULE_SERUM", "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000230206", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0023/A00000023020658ko.png?l=ko&QT=100&SF=webp&sharpen=1x0.5"),

  // 징크 수동 보강
  manual("징크", "Dr.Melaxin", "에스 징크 블레미쉬 크림", "CREAM", "https://melaxin.com/product/detail.html?product_no=2492&cate_no=42&display_group=1", "https://cafe24img.poxo.com/barber501f/web/product/big/202607/dcbbbf3a66b44ebe19dba0963ece0815.png"),
  manual("징크", "Dr.Melaxin", "에스 징크 블레미쉬 젤 클렌저", "CLEANSER", "https://melaxin.com/product/detail.html?product_no=2490&cate_no=42&display_group=1", "https://cafe24img.poxo.com/barber501f/web/product/big/202606/e494d95c1da6c176a0222d9be8917ca6.png"),
  manual("징크", "시드물", "닥터트럽 징크크림", "CREAM", "https://www.sidmool.com/shop/shopdetail.html?branduid=77018&xcode=027&mcode=013&scode=&type=Y&sort=regdate&current_category=027013&GfDT=bmp7W1o%3D", "https://www.sidmool.com/shopimages/sidmool/0220050000282.jpg?1732693111"),
  manual("징크", "닥터에디션", "닥터트럽 징크크림", "CREAM", "https://dr-edition.com/kor/product/detail.html?f_uid=103", "https://dr-edition.com/upload/product/1685597956_0.png"),
  manual("징크", "브링그린", "징크테카 트러블 세럼", "AMPOULE_SERUM", "https://oy.run/0MT94nuKLiWyI9", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0020/A000000200646139ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("징크", "아누아", "어성초 77 B3 징크 수딩 크림", "CREAM", "https://oy.run/W1kwtTW4bBNRO2", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0024/A00000024842206ko.png?l=ko&QT=100&SF=webp&sharpen=1x0.5"),
  manual("징크", "브링그린", "징크테카 약산성 클렌징 젤", "CLEANSER", "https://oy.run/O1YZlhSy80xpSW", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025191507ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("징크", "브링그린", "징크테카 리페어 흔적 크림", "CREAM", "https://oy.run/CmXoNKhpTEhtWd", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0024/A00000024771318ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("징크", "시드물", "징크앰플 25", "AMPOULE_SERUM", "https://www.sidmool.com/shop/shopdetail.html?branduid=77030&sort=sellcnt&xcode=022&mcode=003&scode=&GfDT=a213UA%3D%3D", "https://www.sidmool.com/shopimages/sidmool/0220030000362.jpg?1719965087"),
  manual("징크", "구달", "어성초 징크 히알루론 레드 수딩 세럼", "AMPOULE_SERUM", "https://oy.run/Z4zmBwlAtsU9kL", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025516704ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),

  // 알로에 수동 보강
  manual("알로에", "김정문알로에", "큐어 알로에 워터 젤리 토너", "SKIN_TONER", "http://m-gs.kr/p/01/68563213", "https://asset.m-gs.kr/prod/68563213/1/550"),
  manual("알로에", "김정문알로에", "큐어 알로에 사포나리아 클렌저", "CLEANSER", "http://m-gs.kr/p/01/1009045184", "https://asset.m-gs.kr/prod/1009045184/1/550"),
  manual("알로에", "김정문알로에", "큐어 알로에 수딩젤", "CREAM", "https://oy.run/XKwAMRPwRfkGWA", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0017/A00000017371017ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("알로에", "아로마티카", "수딩 알로에 베라 젤", "CREAM", "https://kurlink.kurly.com/products/5030294", "https://product-image.kurly.com/product/image/c3af03db-92aa-457f-a671-7a76e552590b.jpg"),
  manual("알로에", "시드물", "알로에 스킨 화이트닝 (미스트)", "MIST_OIL", "https://www.sidmool.com/shop/shopdetail.html?branduid=154&sort=sellcnt&xcode=022&mcode=002&scode=&GfDT=bml0W14%3D", "https://www.sidmool.com/shopimages/sidmool/0220020000272.jpg?1704350245"),
  manual("알로에", "이니스프리", "알로에 리바이탈라이징 수딩젤", "CREAM", "https://www.innisfree.com/kr/ko/dp/product/37404", "https://inm-cdn.innisfree.com/origin-image/product/product/00/00/03/74/04/68931809-1d33-4c89-972d-da5faa9fbb9d.webp"),
  manual("알로에", "네이처리퍼블릭", "수딩 앤 모이스처 알로에베라 92% 수딩젤", "CREAM", "https://www.naturerepublic.com/goods/goods/view?no=12938", "https://cfimg.naturerepublic.com/goods/202507/000000000472480.jpg"),
  manual("알로에", "청미정", "알로에발효 클렌징오일", "CLEANSER", "https://oy.run/2xaw1vhaWPyY4u", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025972106ko.png?l=ko&QT=100&SF=webp&sharpen=1x0.5"),
  manual("알로에", "브링그린", "알로에 97% 수딩젤", "CREAM", "https://oy.run/opkFCxv1Q4XROW", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0021/A00000021550262ko.jpg?l=ko&QT=85&SF=webp&sharpen=1x0.5"),
  manual("알로에", "청미정", "알로에발효 약알칼리성 클렌징폼", "CLEANSER", "https://oy.run/Gpl8jowIJGvJeU", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025972405ko.png?l=ko&QT=100&SF=webp&sharpen=1x0.5"),
  manual("알로에", "청미정", "알로에발효 클렌징밀크", "CLEANSER", "https://oy.run/QOt7UoTgUSH7QD", "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0025/A00000025972008ko.png?l=ko&QT=100&SF=webp&sharpen=1x0.5"),
];

const MOCK_PRODUCTS = PRODUCT_DATA.map((product, index) => ({
  ...product,
  id: index + 1,
}));

const normalize = (name: string) => name.replace(/\s/g, "");

export const getMockIngredient = (name: string) =>
  MOCK_INGREDIENTS.find(
    (ingredient) =>
      normalize(ingredient.name) === normalize(name) ||
      (normalize(name) === "징크" && ingredient.name === "징크") ||
      (normalize(name) === "알로에베라" && ingredient.name === "알로에")
  );

const toRecommendedProduct = ({
  id,
  name,
  brand,
  category,
  imageUrl,
  linkUrl,
}: (typeof MOCK_PRODUCTS)[number]): RecommendedProduct => ({
  id,
  name,
  brand,
  category,
  imageUrl,
  linkUrl,
});

// GET /api/products/recommendations 대체
export const getMockProductsByIngredient = (
  ingredientId: number,
  productCategory?: ProductCategory
): RecommendedProduct[] => {
  const ingredient = MOCK_INGREDIENTS.find(({ id }) => id === ingredientId);

  if (!ingredient) {
    return [];
  }

  return MOCK_PRODUCTS.filter(
    (product) =>
      product.ingredients.includes(ingredient.name as IngredientName) &&
      (!productCategory || product.category === productCategory)
  ).map(toRecommendedProduct);
};

// GET /api/routines/{id}/recommended-products 형태로 성분별 제품을 limit개씩 반환
// 제품명에 성분명이 들어간 제품을 우선하고, 여러 성분에 걸친 제품은 한 번만 노출
export const getMockRoutineProducts = (
  ingredientNames: string[],
  limit = 2
): RecommendedRoutineProduct[] => {
  const usedProductIds = new Set<number>();

  return ingredientNames.flatMap((ingredientName) => {
    const ingredient = getMockIngredient(ingredientName);

    if (!ingredient) {
      return [];
    }

    const isNamedAfterIngredient = (product: RecommendedProduct) =>
      normalize(product.name).includes(normalize(ingredient.name));

    return getMockProductsByIngredient(ingredient.id)
      .filter((product) => !usedProductIds.has(product.id))
      .sort(
        (first, second) =>
          Number(isNamedAfterIngredient(second)) -
          Number(isNamedAfterIngredient(first))
      )
      .slice(0, limit)
      .map((product) => {
        usedProductIds.add(product.id);

        return {
          ingredientName: ingredient.name,
          product: { ...product, imageUrl: product.imageUrl ?? "" },
        };
      });
  });
};
