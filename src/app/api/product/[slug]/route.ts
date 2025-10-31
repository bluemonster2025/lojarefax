import { NextResponse } from "next/server";
import { mapProduct } from "@/utils/mappers/mapProduct";
import type { Product, RawProduct } from "@/types/product";

const WP_URL = process.env.WOO_SITE_URL!;

interface GraphQLResponse {
  data?: { product?: RawProduct | null };
  errors?: Array<{ message: string }>;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> } // Next 15: params é Promise
) {
  const { slug } = await params;

  const query = /* GraphQL */ `
    fragment ProductMiniFields on Product {
      id
      slug
      name
      image {
        sourceUrl
        altText
      }
      productTags {
        nodes {
          id
          name
        }
      }
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        price
      }
      ... on ExternalProduct {
        price
      }
      ... on GroupProduct {
        price
      }
      ... on ProductWithPricing {
        price
      }
    }

    fragment ProductCategories on Product {
      productCategories {
        nodes {
          id
          name
          slug
          parentId
        }
      }
    }

    fragment ProductACFSubtitleOnly on Product {
      produto {
        personalizacaoProduto {
          subtitulo
          tituloItensRelacionados
          subtituloItensRelacionados
        }
      }
    }

    fragment AccessoryCardFields on Product {
      ...ProductMiniFields
      ...ProductCategories
      ...ProductACFSubtitleOnly
    }

    fragment ProductACFMain on Product {
      produto {
        personalizacaoProduto {
          bannerProdutoDesktop {
            node {
              sourceUrl
              altText
            }
          }
          bannerProdutoMobile {
            node {
              sourceUrl
              altText
            }
          }
          imagemPrincipal {
            imagemOuPrototipoA {
              node {
                mediaItemUrl
              }
            }
            imagemOuPrototipoB {
              node {
                mediaItemUrl
              }
            }
            modeloProdutoA
            modeloProdutoB
          }
          subtitulo
          tituloItensRelacionados
          subtituloItensRelacionados
          acessoriosMontagem {
            title
            subtitle
            produtos {
              nodes {
                ...AccessoryCardFields
              }
            }
            avisos {
              texto
            }
          }
          especificacoesTecnicas {
            tituloPrincipal
            subtituloPrincipal
            especificacoes {
              titulo
              descricao
            }
          }
          bannerEspecificacoes {
            produto
            titulo
            descricao
            imagem {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }

    fragment RelatedCardFields on Product {
      ...ProductMiniFields
      ...ProductCategories
      ...ProductACFSubtitleOnly
    }

    query ProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        name
        description
        shortDescription
        purchaseNote
        slug
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productTags {
          nodes {
            id
            name
          }
        }
        ...ProductCategories
        ...ProductACFMain
        ... on SimpleProduct {
          purchaseNote
          price
          crossSell {
            nodes {
              ...RelatedCardFields
            }
          }
          upsell {
            nodes {
              ...RelatedCardFields
            }
          }
        }
        ... on VariableProduct {
          purchaseNote
          price
          crossSell {
            nodes {
              ...RelatedCardFields
            }
          }
          upsell {
            nodes {
              ...RelatedCardFields
            }
          }
          variations {
            nodes {
              id
              name
              price
              purchaseNote
              image {
                sourceUrl
                altText
              }
              attributes {
                nodes {
                  attributeId
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { slug } }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar produto" },
        { status: res.status }
      );
    }

    const result: GraphQLResponse = await res.json();

    if (result.errors?.length) {
      console.error("GraphQL errors:", result.errors);
    }

    const raw = result.data?.product;
    if (!raw) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const product: Product = mapProduct(raw);
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
