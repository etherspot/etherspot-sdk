// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

// Components
import { renderHTMLfromPrismic } from 'components/Modals/PrismicDocumentModal/RenderHTMLfromPrismic';

// Services
import * as Prismic from 'services/prismic';

export const mapFromDocumentDataToString = (
  document: Array<Prismic.DocumentData>,
  prismicContent: Array<string>,
  isHtmlContent?: boolean,
): void => {
  document.map((documentData) => {
    if (!documentData.text) return null;
    return isHtmlContent
      ? prismicContent.push(renderHTMLfromPrismic(documentData.type, documentData.text))
      : prismicContent.push(documentData.text);
  });
};
