import { NextResponse } from "next/server";
import { mapProduct } from "@/utils/mappers/mapProduct";
import { Product, RawProduct } from "@/types/product";

const WP_URL = process.env.WOO_SITE_URL!;

interface GraphQLResponse {
  data?: { product?: RawProduct };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // 🔑 Promise
) {
  const { slug } = await params;

  const query = `query ProductBySlug($slug: ID!) {
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

    # 🔹 Campos ACF do produto principal
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
      }
    }

    ... on SimpleProduct {
      price
      purchaseNote

      crossSell {
        nodes {
          ... on SimpleProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

            # 🔹 Campos ACF também nos produtos relacionados
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
              }
            }
          }

          ... on VariableProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on ExternalProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on GroupProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }
        }
      }

      upsell {
        nodes {
          ... on SimpleProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on VariableProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on ExternalProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on GroupProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }
        }
      }
    }

    ... on VariableProduct {
      price
      purchaseNote

      crossSell {
        nodes {
          ... on SimpleProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on VariableProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on ExternalProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on GroupProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }
        }
      }

      upsell {
        nodes {
          ... on SimpleProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on VariableProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on ExternalProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }

          ... on GroupProduct {
            id
            slug
            name
            price
            image {
              sourceUrl
              altText
            }

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
              }
            }
          }
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

    productCategories {
      nodes {
        id
        name
        slug
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

    if (!res.ok)
      return NextResponse.json(
        { error: "Erro ao buscar produto" },
        { status: res.status }
      );

    const result: GraphQLResponse = await res.json();

    if (!result.data?.product)
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );

    const product: Product = mapProduct(result.data.product);
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
