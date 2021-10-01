def getOrderData(data, request):
    for i in range(len(data['items'])):
        img = data['items'][i]['image']
        if img:
            data['items'][i]['image'] = request.build_absolute_uri(img)
    return data