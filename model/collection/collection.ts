import { JsonConverter, JsonObject, JsonProperty } from 'json2typescript';
import { DateConverter, EnumConverter, JsonSerializable } from 'model/json/json.serializable';
import moment from 'moment';
import { ProductCollectionItemImpl, StoreCollectionItemImpl } from './collection.item';

export enum ItemTransition {
  slide = 'slide',
  carousel = 'carousel',
}

export enum CollectionType {
  flash_sale = 'flash_sale',
  product = 'product',
  store = 'store',
}

export interface Collection {
  id: number;
  is_active: boolean;
  title: string;
  color: string;
  index: number;
  background_image: string;
  item_transition: ItemTransition;
  type: CollectionType;
}

interface ExtCollection<T> extends Collection {
  items: T[];
}

export interface StoreCollection extends ExtCollection<StoreCollectionItemImpl> { }

export interface ProductCollection extends ExtCollection<ProductCollectionItemImpl> { }

export interface FlashSaleCollection extends ProductCollection {
  start_at?: Date;
  end_at?: Date;
}

@JsonConverter
class ItemTransitionConverter extends EnumConverter<ItemTransition> {
  constructor() {
    super(ItemTransition, 'ItemTransition');
  }
}

@JsonConverter
class CollectionTypeConverter extends EnumConverter<CollectionType> {
  constructor() {
    super(CollectionType, 'CollectionType');
  }
}

@JsonObject('CollectionImpl')
class CollectionImpl extends JsonSerializable<CollectionImpl> implements Collection {
  @JsonProperty('pk', Number, false)
  id!: number;

  @JsonProperty('is_active', Boolean, true)
  is_active = false;

  @JsonProperty('title', String, true)
  title = '';

  @JsonProperty('color', String, true)
  color = 'white';

  @JsonProperty('index', Number, true)
  index = 0;

  @JsonProperty('background_image', String, true)
  background_image = '';

  @JsonProperty('item_transition', ItemTransitionConverter, true)
  item_transition = ItemTransition.slide;

  @JsonProperty('type', CollectionTypeConverter, false)
  type!: CollectionType;

  protected get classRef(): new () => CollectionImpl {
    return CollectionImpl;
  }
}

@JsonObject('StoreCollectionImpl')
export class StoreCollectionImpl extends CollectionImpl implements StoreCollection {
  @JsonProperty('items', [StoreCollectionItemImpl], true)
  items: StoreCollectionItemImpl[] = [];

  protected get classRef(): new () => StoreCollectionImpl {
    return StoreCollectionImpl;
  }
}

@JsonObject('ProductCollectionImpl')
export class ProductCollectionImpl extends CollectionImpl implements ProductCollection {
  @JsonProperty('items', [ProductCollectionItemImpl], true)
  items: ProductCollectionItemImpl[] = [];

  protected get classRef(): new () => ProductCollectionImpl {
    return ProductCollectionImpl;
  }
}

@JsonObject('FlashSaleCollectionImpl')
export class FlashSaleCollectionImpl extends ProductCollectionImpl implements FlashSaleCollection {
  @JsonProperty('start_at', DateConverter, true)
  start_at?: Date;

  @JsonProperty('end_at', DateConverter, true)
  end_at?: Date;

  protected get classRef(): new () => FlashSaleCollectionImpl {
    return FlashSaleCollectionImpl;
  }

  get valid(): boolean {
    return moment(moment.now()).isBetween(moment(this.start_at), moment(this.end_at));
  }
}
