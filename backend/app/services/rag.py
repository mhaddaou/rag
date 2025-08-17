from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import OllamaEmbeddings
from langchain_ollama.llms import OllamaLLM
from dotenv import load_dotenv
from langchain_chroma import Chroma
import pymupdf4llm
from langchain.schema import Document


import os

load_dotenv()

base_url = os.getenv("BASE_URL")
base_model = os.getenv("MODEL_EMBEDDING")
model = os.getenv("MODEL")


async def storing_embedding(file_path: str, sessionId: str):

    md_text = pymupdf4llm.to_markdown(file_path)
    text = md_text.replace("\n\n\n", "\n").replace("\n\n", "\n")
    print(text)
    documents = [
        Document(page_content=text, metadata={
                 "source": file_path.split("/")[-1]})
    ]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_documents(documents)
    embedding = OllamaEmbeddings(base_url=base_url, model=base_model)
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding,
        collection_name=sessionId,
        host="localhost",
        port=8000
    )


async def retriever(sessionId: str, query: str):
    embedding = OllamaEmbeddings(base_url=base_url, model=base_model)

    db = Chroma(
        collection_name=sessionId,
        embedding_function=embedding,
        host="localhost",
        port=8000
    )
    retriever = db.as_retriever(search_type="similarity_score_threshold", search_kwargs={
                                "k": 3, "score_threshold": 0.4})

    docs = retriever.invoke(query)
    print("----------------------------------------------------------------")
    for doc in docs:
        print(doc.page_content)
        print("----------------")
    print("----------------------------------------------------------------")
    combined_docs = "\n\n".join([doc.page_content for doc in docs])
    
    

    combined_input = f"""
You are an AI assistant.

Rules:
1. First, check if the user's message is a question about the provided documents.
   - If it is related → answer **only** from the documents.
   - If it is unrelated (greetings, casual talk, personal questions, etc.) → completely ignore the documents and respond naturally.
2. If the question is related but the answer is not in the documents → respond with exactly: "I'm not sure".
3. Never mention the documents unless the user is explicitly asking about them.

User message:
{query}

Relevant documents:
{combined_docs}

Now, give your final answer according to the rules above:
"""

    messages = [
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=combined_input),
    ]
    
    
    llm = OllamaLLM(base_url=base_url, model="gemma3:4b")
    async for chunk in llm.astream(messages):
        if chunk:
            yield chunk
