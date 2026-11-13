import heroEditorialImg from '../assets/images/hero_nowas_editorial_1794560218879.jpg';
import editorialFeatureImg from '../assets/images/editorial_art_dressing_1794560220175.jpg';
import campaignWideImg from '../assets/images/campaign_wide_streetwear_1794560219997.jpg';

import vintageBlueJeansImg from '../assets/images/prod_vintage_blue_baggy_jeans_1794560220312.jpg';
import washedBlackJeansImg from '../assets/images/prod_washed_black_baggy_jeans_1794560220844.jpg';
import distressedWideDenimImg from '../assets/images/prod_distressed_wide_denim_1794560220795.jpg';
import classicBaggyTrousersImg from '../assets/images/prod_classic_baggy_trousers_1794560221710.jpg';
import pleatedWideTrousersImg from '../assets/images/prod_pleated_wide_trousers_1794560221694.jpg';
import baggyDenimJortsImg from '../assets/images/prod_baggy_denim_jorts_1794560221556.jpg';
import carpenterJortsImg from '../assets/images/prod_carpenter_jorts_1794560221017.jpg';
import vintagePatternShirtImg from '../assets/images/prod_vintage_pattern_shirt_1794560222878.jpg';
import retroStripedShirtImg from '../assets/images/prod_retro_striped_shirt_1794560222544.jpg';
import oversizedGraphicTeeImg from '../assets/images/prod_oversized_graphic_tee_1794560222882.jpg';
import plainOversizedTeeImg from '../assets/images/prod_plain_oversized_tee_1794560224333.jpg';
import washedBoxyTeeImg from '../assets/images/prod_washed_boxy_tee_1794560223954.jpg';
import heavyweightHoodieImg from '../assets/images/prod_heavyweight_hoodie_1794560223577.jpg';
import knitSweaterImg from '../assets/images/prod_knit_sweater_1794560223488.jpg';
import zipDropHoodieImg from '../assets/images/prod_zip_drop_hoodie_1794560224215.jpg';
import relaxedCargoPantsImg from '../assets/images/prod_relaxed_cargo_pants_1794560224910.jpg';
import multipocketCargosImg from '../assets/images/prod_multipocket_cargos_1794560224656.jpg';
import minimalistWhiteSneakersImg from '../assets/images/prod_minimalist_white_sneakers_1794560225555.jpg';
import chunkyStreetSneakersImg from '../assets/images/prod_chunky_street_sneakers_1794560227062.jpg';
import everydaySlidesImg from '../assets/images/prod_everyday_slides_1794560226075.jpg';
import sculptedMuleSlidesImg from '../assets/images/prod_sculpted_mule_slides_1794560226811.jpg';
import streetwearTwoPieceImg from '../assets/images/prod_streetwear_twopiece_set_1794560226803.jpg';
import waffleResortTwoPieceImg from '../assets/images/prod_waffle_resort_twopiece_1794560228167.jpg';
import classicBaseballCapImg from '../assets/images/prod_classic_baseball_cap_1794560227755.jpg';
import canvasCrossbodyBagImg from '../assets/images/prod_canvas_crossbody_bag_1794560227363.jpg';

import { Category, Product } from '../types/store';
import { CATALOGUE_SEED_PRODUCTS } from './catalogueData';

const IMAGE_MAP: Record<string, string> = {
  vintageBlueJeansImg,
  washedBlackJeansImg,
  distressedWideDenimImg,
  classicBaggyTrousersImg,
  pleatedWideTrousersImg,
  baggyDenimJortsImg,
  carpenterJortsImg,
  vintagePatternShirtImg,
  retroStripedShirtImg,
  oversizedGraphicTeeImg,
  plainOversizedTeeImg,
  washedBoxyTeeImg,
  heavyweightHoodieImg,
  knitSweaterImg,
  zipDropHoodieImg,
  relaxedCargoPantsImg,
  multipocketCargosImg,
  minimalistWhiteSneakersImg,
  chunkyStreetSneakersImg,
  everydaySlidesImg,
  sculptedMuleSlidesImg,
  streetwearTwoPieceImg,
  waffleResortTwoPieceImg,
  classicBaseballCapImg,
  canvasCrossbodyBagImg,
};

export const EDITORIAL_ASSETS = {
  hero: heroEditorialImg,
  artOfDressing: editorialFeatureImg,
  campaignWide: campaignWideImg,
};

export interface CategoryMeta {
  name: Category;
  subtitle: string;
  coverImage: string;
}

export const CATEGORY_HIGHLIGHTS: CategoryMeta[] = [
  { name: 'Baggy Jeans', subtitle: 'Wide-leg & vintage washes', coverImage: vintageBlueJeansImg },
  { name: 'Baggy Trousers', subtitle: 'Tailored relaxed drape', coverImage: classicBaggyTrousersImg },
  { name: 'Baggy Knickers / Jorts', subtitle: 'Below-knee utility cuts', coverImage: baggyDenimJortsImg },
  { name: 'Vintage Shirts', subtitle: 'Camp-collar & archival prints', coverImage: vintagePatternShirtImg },
  { name: 'Oversized T-Shirts', subtitle: '300gsm drop-shoulder jersey', coverImage: oversizedGraphicTeeImg },
  { name: 'Hoodies and Sweaters', subtitle: 'Heavy fleece & ribbed knits', coverImage: heavyweightHoodieImg },
  { name: 'Cargo Pants', subtitle: 'Articulated utility pockets', coverImage: relaxedCargoPantsImg },
  { name: 'Sneakers', subtitle: 'Clean leather & sculpted runners', coverImage: minimalistWhiteSneakersImg },
  { name: 'Slides', subtitle: 'Molded everyday footwear', coverImage: everydaySlidesImg },
  { name: 'Two-Piece Outfits', subtitle: 'Coordinated matching sets', coverImage: streetwearTwoPieceImg },
  { name: 'Caps and Accessories', subtitle: 'Finishing streetwear staples', coverImage: classicBaseballCapImg },
];

export const PRODUCTS: Product[] = CATALOGUE_SEED_PRODUCTS.map((item) => ({
  ...item,
  image: IMAGE_MAP[item.image] ?? item.image,
}));
