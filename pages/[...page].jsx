import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  BuilderComponent,
  builder,
  useIsPreviewing,
  Builder,
} from "@builder.io/react";
import InputField from "../components/InputField";
import { postData } from "../hooks";
// Initialize the Builder SDK with your organization's API Key
// Find the API Key on: https://builder.io/account/settings
builder.init("6653b345bfad44598f857df9e89d4a03");

export async function getStaticProps({ params }) {
  // Fetch the first page from Builder that matches the current URL.
  // Use the `userAttributes` field for targeting content.
  // For more, see https://www.builder.io/c/docs/targeting-with-builder
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/" + (params?.page?.join("/") || ""),
      },
    })
    .toPromise();

  return {
    props: {
      page: page || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  //  Fetch all published pages for the current model.
  //  Using the `fields` option will limit the size of the response
  //  and only return the `data.url` field from the matching pages.
  const pages = await builder.getAll("page", {
    fields: "data.url", // only request the `data.url` field
    options: { noTargeting: true },
    limit: 0,
  });

  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  };
}

export default function Page({ page }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  //  This flag indicates if you are viewing the page in the Builder editor.
  const login = () => {
    const email = document.getElementById("email");
    console.log(email.value);
  };
  const createUser = () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const gender = document.getElementById("gender").value;
    console.log(`name: ${name}, Email: ${email}, Gender: ${gender}`);
    postData("https://gorest.co.in/public/v2/users", {
      id: Math.floor(4000 + Math.random() * 9000),
      name,
      email,
      gender,
      status: "active",
    })
      .then((val) => {
        console.log(val);
        if (val.status == 201) setIsLoggedIn(true);
        if (val.status == 422) return val.json();
      })
      .then((data) => {
        console.log(data);
        setErrorMessage(data);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };
  const createAnotherUser = () => {
    setIsLoggedIn(false);
  };
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  //  Add your error page here to return if there are no matching
  //  content entries published in Builder.
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        {/* Add any relevant SEO metadata or open graph tags here */}
        <title>{page?.data.title}</title>
        <meta name="description" content={page?.data.descripton} />
      </Head>
      <BuilderComponent
        model="page"
        content={page}
        data={{ isLoggedIn }}
        context={{
          login,
          createUser,
          createAnotherUser,
        }}
      />
      <div style={{ textAlign: "center" }}>
        {errorMessage?.length > 0 && (
          <div>
            <h2>Error while creating User</h2>
            {errorMessage.map((val) => (
              <div key={val}>
                {val.field}: {val.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

//  This is an example of registering a custom component to be used in Builder.io.
//  You would typically do this in the file where the component is defined.

const MyCustomComponent = (props) => (
  <div>
    <h1>{props.title}</h1>
    <p>{props.description}</p>
  </div>
);

//  This is a minimal example of a custom component, you can view more complex input types here:
//  https://www.builder.io/c/docs/custom-react-components#input-types
Builder.registerComponent(MyCustomComponent, {
  name: "ExampleCustomComponent",
  inputs: [
    { name: "title", type: "string", defaultValue: "I am a React component!" },
    {
      name: "description",
      type: "string",
      defaultValue: "Find my source in /pages/[...page].js",
    },
  ],
});

const Heading = (props) => {
  const { title, textAlign = "center" } = props;
  return (
    <div style={{ textAlign: textAlign }}>
      <h1>{title}</h1>
    </div>
  );
};

Builder.registerComponent(Heading, {
  name: "Heading",
  inputs: [
    { name: "title", type: "text" },
    { name: "textAlign", type: "text", placeholder: "left | center | right" },
  ],
});

Builder.registerComponent(InputField, {
  name: "InputField",
  inputs: [
    { name: "fieldName", type: "text" },
    { name: "placeholder", type: "text" },
    { name: "type", type: "text", defaultValue: "text" },
    { name: "id", type: "text" },
  ],
});

Builder.register("insertMenu", {
  name: "My Components",
  items: [
    { item: "InputField", name: "Custom Input Field" },
    { name: "Heading", item: "Heading" },
  ],
});
