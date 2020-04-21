/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    async function processArray(): Promise<void> {
      for (const uploadedFile of uploadedFiles) {
        data.append('file', uploadedFile.file);

        try {
          await api.post('/transactions/import', data);
        } catch (err) {
          console.log(err.response.error);
        }

        data.delete('file');
      }
    }

    await processArray();

    history.push('/');
  }

  function submitFile(files: File[]): void {
    files.forEach((file) => {
      const newFile: FileProps = {
        file,
        name: file.name,
        readableSize: String(file.size),
      };

      setUploadedFiles([...uploadedFiles, newFile]);
    });
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
