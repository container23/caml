#!/bin/bash

OUTPUT_DIR=~/amlkyc-data-sources
## Use custom output directory if provided
if [ -n "$1" ]; then 
    OUTPUT_DIR="$1"
fi

AML_FILE_NAME=sdnlist.txt
OUTPUT_PATH=$OUTPUT_DIR/$AML_FILE_NAME
TMP_OUTPUT_DIR=/tmp
TREASURY_HOST=treasury.gov
AML_FILE_SOURCE=https://www.$TREASURY_HOST/ofac/downloads/sdnlist.txt
CHECKSUMS_FILE_SOURCE=https://home.$TREASURY_HOST/policy-issues/financial-sanctions/specially-designated-nationals-list-sdn-list/hash-values-for-ofac-sanctions-list-files
CHECKSUMS_FILE_NAME=sndlist_checksums.html

## ensure the download paths dirs are available
mkdir -p $OUTPUT_DIR $TMP_OUTPUT_DIR

# download AML file
echo "Downloading latest AML list $AML_FILE_NAME file from $TREASURY_HOST ..."
curl -s -o $TMP_OUTPUT_DIR/$AML_FILE_NAME $AML_FILE_SOURCE

# download and verify checkssums
echo "Verifying downloaded AML file checksum..."
curl -s -o $TMP_OUTPUT_DIR/$CHECKSUMS_FILE_NAME $CHECKSUMS_FILE_SOURCE
## extract the sha256 hash from the file
EXPECTED_CHECKSUM=$(grep -Po "sdnlist\.txt\s{1,}\x{00A0}\s\x{00A0}SHA-256:\s([a-zA-Z0-9]{64})" $TMP_OUTPUT_DIR/$CHECKSUMS_FILE_NAME | grep -Eo "([a-zA-Z0-9]{64})")
DOWNLOADED_CHECKSUM=$(sha256sum $TMP_OUTPUT_DIR/$AML_FILE_NAME | grep -Eo "([a-zA-Z0-9]{64})")

## Verify downloaded file matches expected
if [ "$EXPECTED_CHECKSUM" = "$DOWNLOADED_CHECKSUM" ]; then
    ## move downloaded file to final output path
    mv $TMP_OUTPUT_DIR/$AML_FILE_NAME $OUTPUT_PATH
    echo "Saved latest AML file to ${OUTPUT_PATH}"
else 
    echo "Checksum validation failed: downloaded SHA256 checksum '$DOWNLOADED_CHECKSUM' != '$EXPECTED_CHECKSUM'"
fi

## clean up downloaded files
rm -f $TMP_OUTPUT_DIR/$CHECKSUMS_FILE_NAME
echo "Done!"
